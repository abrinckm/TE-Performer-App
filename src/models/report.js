const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const { ReportWrapper } = require('../wrapper');

class Report extends BaseModel {
    constructor(params) {
        super(params);
        this.wrapper = new ReportWrapper(params);

        this.data = {
            id: null,
            problemLabel: null,
            problemVersion: null,
            problemConditionLabel: null,
            problemBlockLabel: null,
            authorUserName: null,
            authorTeamLabel: null,
            authorOrgName: null,
            zipFileId: null,
            uploadDate: null,
            creationDate: null
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
    Find record will return a single report by id
    @params id {string}
    */
    static findRecord(id) {
        const wrapper = new ReportWrapper();
        return wrapper.getById(id)
            .then(data => {
                return new Report(data);
            });
    }

    /*
    Find all will return a list of all reports
     */
    static findAll() {
        const wrapper = new ReportWrapper();
        return wrapper.listAll()
            .then(results => {
                return results.reduce((models, data) => {
                    models.push(new Report(data));
                    return models;
                }, []);
            });
    }

    get(attr) {
        return _.get(this.data, attr);
    }

    set(attr, val) {
        return _.set(this.data, attr, val);
    }
}

module.exports = Report;
