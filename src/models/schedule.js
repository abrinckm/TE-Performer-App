const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const logger = require('../../logger');

const { ScheduleWrapper } = require('../wrapper');
const wrapper = new ScheduleWrapper();

class Schedule extends BaseModel {
  constructor(params) {
    super(params);
  
    this.data = {
      id: null,
      problemLabel: null,
      conditionLabel: null,
      blockLabel: null, 
      systemLabel: null,
      mode: null, 
      startDate: null,
      endDate: null
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
    if (filter === 'byContext') {
      let _q = q[filter];
      func = 'listByContext';
      values = [_q.conditionLabel, _q.blockLabel];
    // ** byUserId **
    } else if (filter === 'byUserId') {
      let id = q[filter];
      func = 'listActiveScheduleEntriesByUserId';
      values = [id];
    }

    // ------------
    if (func && values) {
      return wrapper[func](...values)
        .then(results => {
          return results.reduce((models, entry) => {
            models.push(new Schedule(entry));
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
    return wrapper.getByEntryId(id)
      .then(entry => {
        return new Schedule(entry);
      })
    ;
  }

  /*
  Find all records
  */
  static findAll() {
    return wrapper.listAll()
      .then(entries => {
        return entries.reduce((models, entry) => {
          models.push(new Schedule(entry));
          return models;
        }, []);
      })
    ;
  }

  get(attr) {
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

module.exports = Schedule;