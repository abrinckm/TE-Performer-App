const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const logger = require('../../logger');

const { ProblemWrapper } = require('../wrapper');
const wrapper = new ProblemWrapper();

class Problem extends BaseModel {
  constructor(params) {
    super(params);
  
    this.data = {
      id: null,
      version: null,
      label: null,
      title: null,
      summary: null,
      zipFileId: null,
      imageUri: null,
      imageFileId: null,
      uploadDate: null
    };

    const self = this;
    const data = params.data ? params.data : params;
    Object.keys(data).forEach(attr => {
      if (_.has(self.data, attr)) { 
        self.data[attr] = params[attr]; 
      }
    });
  }

  /*
  Query is meant to return a list of records for the resource.
  @params q {JSON}
  */
  static query(q) {
    let func, values;
    let keys = Object.keys(q);
    let filter = keys[0];

    // ** byContext **
    if (filter === 'byLabel') {
      let _q = q[filter];
      func = 'getProblemMetaByLabel';
      values = [_q];
    // ** byUserId **
    } else if (filter === 'byUserId') {
      let id = q[filter];
      func = 'listByUserId';
      values = [id];
    }

    // ------------
    if (func && values) {
      return wrapper[func](...values)
        .then(results => {
          if (!_.isArray(results)) { return [new Problem(results)]; }
          return results.reduce((models, entry) => {
            models.push(new Problem(entry));
            return models;
          }, []);
        })
      ;
    }
  }

  /*
  Find record will return a single record by id
  @params id {string} 
  */
  static findRecord(id) {
    return wrapper.getByProblemId(id)
      .then(entry => {
        return new Problem(entry);
      })
    ;
  }

  /*
  Find all records
  */
  static findAll() {
    return wrapper.listAll()
      .then(entries => {
        if (!_.isArray(entries)) { return [new Problem(entries)]; }
        return entries.reduce((models, entry) => {
          models.push(new Problem(entry));
          return models;
        }, []);
      })
    ;
  }

  static download(fileId) {
    return wrapper.getProblemFile(fileId)
      .then(archive => {
        return archive;
      });
  }

  get(attr) {
    if (attr === 'zipfile') {
      if (this.data.zipFileId === '' || !this.data.zipFileId) {
        return new Promise((resolve, reject) => {resolve('no file');});
      }
      return wrapper.getProblemFile(this.data.zipFileId);
    }
    return _.get(this.data, attr);
  }

  set(attr, val) {
    return _.set(this.data, attr, val);
  }

  /* 
  Save will update the resource from the current state of this model. 
  */
  save() {
    // (Schedule does not have the ability to save)
    logger.error(
      'Cannot save Schedule: This functionality is not exposed by the API.'
    );
  }
}

module.exports = Problem;