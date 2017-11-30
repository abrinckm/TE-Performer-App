const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const { UserProfileWrapper } = require('../wrapper');

const logger = require('../../logger');

class UserProfile extends BaseModel {

  constructor(params) {
    super(params);
    this.wrapper = new UserProfileWrapper(params);

    this.data = {
      id: null,
      userTag: null,
      userName: null,
      emailAddress: null,
      userAttributesId: null,
      teamIds: null,
      blockLabel: null,
      conditionLabel: null,
      lastActive: null,
      trainedOn: null
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
  Sample query bodies include: 
    { 
      attributes : {
        byUserProfileId: "blah"
      }
    }

  -OR-

    {
      byContext : {
        conditionLabel : "blah",
        blockLabel: "blah"
      }
    }
  */
  static query(q) {
    const wrapper = new UserProfileWrapper();

    let func, values;
    let keys = Object.keys(q);
    let filter = keys[0];

    // ** byIds **
    if (filter === 'byIds') {
      let value = q[filter];
      if (!_.isArray(value)) {
        const error = 'UserProfile.query() byIds filter expects an array of ids';
        return new Promise((resolve, reject) => reject(error));
      }
      func = 'listByIds';
      values = [value];
    // ** byConditionLabel **
    } else if (filter === 'byConditionLabel') {
      let value = q[filter];
      func = 'listByConditionLabel';
      values = [value];
    // ** byContext **
    } else if (filter === 'byContext') {
      let _q = q[filter];
      if (!_q.conditionLabel || !_q.blockLabel) {
        const error = 'UserProfile.query() byContext expects {\'conditionLabel\': \'<val>\',  \'blockLabel\': \'<val>\'} ';
        return new Promise((resolve, reject) => reject(error));
      }
      func = 'listByContext';
      values = [_q.conditionLabel, _q.blockLabel];
    }

    // ----------------------------
    if (func && values) {
      return wrapper[func](...values)
        .then(results => {
          if (!_.isArray(results)) { return [new UserProfile(results)]; }
          return results.reduce((models, userdata) => {
            models.push(new UserProfile(userdata));
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
    const wrapper = new UserProfileWrapper();
    return wrapper.getByUserId(id)
      .then(userdata => {
        return new UserProfile(userdata);
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
  Save will update the resource from the current state of this model. 
  */
  save() {
    // (as of the writing of this comment, only the 'lastActive' and 'trained' attributes can be updated.)
    let { id, trainedOn, lastActive } = this.data;
    const model = this;

    // Iterate through each 'trainedOn' and save the current booleans
    const promiseToUpdateTrained = Object.keys(trainedOn).reduce((_p, condition) => {
      let val = trainedOn[condition];
      return _p.then(model.wrapper.updateTrained.bind(model.wrapper, id, condition, val));
    }, new Promise((r)=>{r()}));

    // Iterate through each 'lastActive' and save the current timestamps
    return Object.keys(lastActive).reduce((_p, condition) => {
      let val = lastActive[condition];
      return _p.then(model.wrapper.updateLastActive.bind(model.wrapper, id, condition, val));
    }, promiseToUpdateTrained);
  }
}

module.exports = UserProfile;