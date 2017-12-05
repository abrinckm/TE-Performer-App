"""
This script validates a problem or report zip file. It checks that:
* the zip file is a valid archive
* metadata.xml exists and is a valid XML file
* validates metadata.xml against the XML schema (.xsd file)
* validates each URI by checking if the target file and anchor exists
* validates that target HTML files are valid XHTML

It was writen in Python 2.7.13

Usage:
   $ python createapi_validate_zip.py <zipfile> <xml-schema-file>
 E.g.
   $ python createapi_validate_zip.py problem-bornine_v4.zip iarpacreate-v1-0.xsd
   $ python createapi_validate_zip.py report_artfuldeception_johndoe145.zip iarpacreate-v1-0.xsd
"""

import lxml
import bs4
import zipfile
import tempfile
import os
import shutil
import sys
import urllib

_VERSION_ = "1.2"


def _info(msg):
    print "[INFO] {0}".format(msg)


def _error(msg, msg2=None):
    print ""
    print "ERROR: {0}".format(msg)
    if msg2 is not None:
        print msg2
    print ""


def extract_zip_file(zipfilename):
    if not os.path.isfile(zipfilename):
        _error("{0} does not exist".format(zipfilename))
        return None

    if not zipfile.is_zipfile(zipfilename):
        _error("{0} is not a valid zip file".format(zipfilename))
        return None

    tmpdir  = tempfile.mkdtemp(prefix="create_tmp")
    with zipfile.ZipFile(zipfilename, 'r') as myzip:
        myzip.extractall(tmpdir)
        _info("Extracted to " + str(tmpdir))
    return tmpdir


def validate_metadata_xml(topdir, schemafile):
    metadataxml = os.path.join(topdir, 'metadata.xml')
    if not os.path.isfile(metadataxml):
        _error("metadata.xml not found in {0}".format(topdir))
        return None

    parser = lxml.etree.XMLParser(ns_clean=True)
    try:
        doc = lxml.etree.parse(metadataxml, parser)
    except:
        _error("problem parsing metadata.xml")
        print parser.error_log
        return None

    xmlschema_doc = lxml.etree.parse(schemafile)
    xmlschematree = lxml.etree.XMLSchema(xmlschema_doc)
    if not xmlschematree.validate(doc):
        _error("metadata.xml does not match XSD schema")
        print xmlschematree.error_log
        return None
    _info("metadata.xml found and validated against schema")
    return doc


def validate_uris(topdir, metadatadoc):
    urilist = metadatadoc.xpath( "/*//@uri")
    error_count = 0
    parser = lxml.etree.XMLParser(ns_clean=True)
    for uri in urilist:
        s  = uri.split("#")
        basefile = urllib.unquote(s[0].replace("/", os.path.sep))
        f = os.path.join(topdir, basefile)
        _info("uri={0}".format(uri))
        if not os.path.isfile(f):
            _error("Unable to find file for uri={0}".format(f))
            error_count += 1
        else:
            _info("     -> file found")
            isvalid = True
            if basefile.endswith("html"):
                try:
                    doc = lxml.etree.parse(f, parser)
                except:
                    _error("problem parsing {0} as XHTML".format(basefile), parser.error_log)
                    error_count += 1
                    isvalid = False
                if isvalid:
                    _info("     -> file validated as XHTML")

            if isvalid and len(s) > 1:
                anchor = s[1]
                with open(f) as fp:
                    soup = bs4.BeautifulSoup(fp, 'lxml')
                    div = soup.find(attrs={"id": anchor})
                    if div is None:
                        _error("Unable to find anchor for uri={0}" + uri)
                        error_count += 1
                    else:
                        _info("     -> anchor found & validated")
                        # print str(div)
    return error_count


if __name__ == "__main__":

    if len(sys.argv) > 2:
        zipfilename = sys.argv[1]
        schemafile = sys.argv[2]
    else:
        print "Ver {0}. Usage:\n  {1} <zipfile> <xsd schema file>".format(_VERSION_, sys.argv[0])
        exit(1)

    _info("Zip file = {0}".format(zipfilename))
    _info("XSD schema = {0}".format(schemafile))

    topdir = extract_zip_file(zipfilename)
    if topdir is not None:
        doc = validate_metadata_xml(topdir, schemafile)

        if doc is not None:
            error_count = validate_uris(topdir, doc)

            if error_count == 0:
                print "\n** {0} is valid **".format(zipfilename)
            else:
                print "\n** Errors found with {0} **".format(zipfilename)

        if os.path.isdir(topdir):
            shutil.rmtree(topdir)
