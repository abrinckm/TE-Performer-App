const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const { UserProfileWrapper } = require('../wrapper');

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
        'block-label': "blah"
      }
    }
  */
  static query(q) {
    const wrapper = new UserProfileWrapper();

    let func, values;
    let keys = Object.keys(q);
    let filter = keys[0];

    if (filter === 'byIds') {
      let value = q[filter];
      if (!_.isArray(value)) {
        const error = 'UserProfile.query() byIds filter expects an array of ids';
        return new Promise((resolve, reject) => reject(error));
      }
      let func = 'listByIds';
      let values = [value];
    } 

    // -------
    return wrapper[func](...values)
      .then(results => {
        return results.data.reduce((models, userdata) => {
          models.push(new UserProfile(userdata));
          return models;
        }, []);
      })
    ;
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

  get(attr) {
    return _.get(attr, this.data);
  }

  /* 
  Save will update the resource from the current state of this model. 
  */
  save() {
    // (as of the writing of this comment, only the 'lastActive' and 'trained' attributes can be updated.)
    let { id, trainedOn, lastActive } = this.data;
    const model = this;
    Object.keys(trainedOn).reduce((_p, condition) => {
      let val = trainedOn[condition];
      return _p.then(model.wrapper.updateTrained.bind(wrapper, id, condition, val));
    }, new Promise((r)=>{r()}));
  }
}

module.exports = UserProfile;