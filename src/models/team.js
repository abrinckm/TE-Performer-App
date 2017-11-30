const BaseModel = require('./base-model');
const Promise = require('bluebird');
const _ = require('lodash');
const { TeamWrapper } = require('../wrapper');

class Team extends BaseModel {
    constructor(params) {
        super(params);
        this.wrapper = new TeamWrapper(params);

        this.data = {
            id: null,
            label: null,
            problemLabel: null,
            conditionLabel: null,
            blockLabel: null,
            systemLabel: null,
            userProfileIds: null,
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
      Query returns a list of teams

      @params q {JSON}
        {
          byContext : {
            conditionLabel : "bard",
            'blockLabel': "3"
          }
        }
      */
    static query(q) {
        const wrapper = new TeamWrapper();
        let func = Object.keys(q)[0];
        let value = q[func];

        switch(func) {
            case 'getByIds': {
                if(!Array.isArray(value)) {
                    return new Promise((resolve, reject) => reject('Team.query() byIds expects an array of IDs'));
                }
                value = [value];
            } break;
            case 'getByConditionLabel': break;
            case 'getByContext': break;
            case 'getByProfileId': break;
            default:
                return new Promise((resolve, reject) => reject(`Unknown function call: ${func}`));
        }

        return wrapper[func](...Object.values(value))
            .then(results => {
                if (!_.isArray(results)) { return [new Team(results)]; }
                return results.reduce((models, data) => {
                    models.push(new Team(data));
                    return models;
                }, []);
            });
    }

    /*
    Find record will return a single team by id
    @params id {string}
    */
    static findRecord(id) {
        const wrapper = new TeamWrapper();
        return wrapper.getById(id)
            .then(data => {
                return new Team(data);
            });
    }

    /*
    Find all will return a list of all teams
     */
    static findAll() {
        const wrapper = new TeamWrapper();
        return wrapper.listAll()
            .then(results => {
                if (!_.isArray(results)) { return [new Team(results)]; }
                return results.reduce((models, data) => {
                    models.push(new Team(data));
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

module.exports = Team;