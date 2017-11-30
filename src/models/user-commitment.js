const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const logger = require('../../logger');

const { UserCommitmentWrapper } = require('../wrapper');
const wrapper = new UserCommitmentWrapper();

class UserCommitment extends BaseModel {
  constructor(params) {
    super(params);

    this.data = {
      id: null,
      userProfileId: null,
      problemLabel: null,
      systemLabel: null,
      commitmentDate: null
    };
    
    const self = this;
    const data = params.data ? params.data : params;
    Object.keys(data).forEach(attr => {
      if (_.has(self.data, attr)) { 
        self.data[attr] = params[attr]; 
      }
    });
  }

  static query(q) {
    let func, values;
    let keys = Object.keys(q);
    let filter = keys[0];

    /** bySystemLabel **/
    if (filter === 'bySystemLabel') {
      func = 'listBySystemLabel';
      values = [q[filter]];
    } else if (filter === 'byProfileId') {
    /** byProfileId **/
      func = 'listByProfileId';
      const { userProfileId, systemLabel, problemLabel } = q[filter];
      values = [userProfileId, problemLabel, systemLabel];
    }

    // ----------------------------
    if (func && values) {
      return wrapper[func](...values)
        .then(results => {
          if (!_.isArray(results)) { return [new UserCommitment(results)]; }
          return results.reduce((models, data) => {
            models.push(new UserCommitment(data));
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
    return wrapper.getByCommitmentId(id)
      .then(data => {
        return new UserCommitment(data);
      })
    ;
  }

  /*
  Find all records
  */
  static findAll() {
    // (UserProfile does not have the ability to list all records)
    logger.error(
      'Cannot list all UserProfiles... Please try one of these filters: [byIds, byConditionLabel, byContext]'
    );
  }

  get(attr) {
    return _.get(this.data, attr);
  }

  set(attr, val) {
    return _.set(this.data, attr, val);
  }

  /* 
  Save will create a new user commitment resource. 
  */
  save() {
    const { userProfileId, problemLabel, systemLabel } = this.data;
    if (!userProfileId || !problemLabel || !systemLabel) {
      const error = 
        `Can't save() userCommitment. Missing either 'userProfileId', 'problemLabel', and/or 'systemLabel'. Use set() to set them first.`;
      return new Promise((resolve, reject)=>reject(error));
    }
    return wrapper.create(userProfileId, problemLabel, systemLabel);
  }
}

module.exports = UserCommitment;