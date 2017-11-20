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