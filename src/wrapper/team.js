const BaseWrapper = require('./base-wrapper');

class TeamWrapper extends BaseWrapper {
    constructor(params) {
        super(params);
        this.apiUrl += '/team';
    }

    apiGet(url, description) {
        const self = this;
        self.logger.info(description);
        return self.get(url)
            .then(response => {
                let result = JSON.parse(response).data;
                self.logger.info(result);
                return result;
            })
            .catch(e => {
                self.logger.error(e);
            });
    }

    listAll() {
        let url = '/get';
        let description = 'Fetching a list of all teams...';
        this.apiGet(url, description);
    }

    getById(id) {
        let url  = `/get/${id}`;
        let description = `Fetching team with ID: ${id}`;
        this.apiGet(url, description);
    }

    getByIds(idArray) {
        let idList = idArray.join(',');
        let url = `/get/byIds/${idList}`;
        let description = `Fetching team(s) with ID(s): ${idList}`;
        this.apiGet(url, description);
    }

    getByConditionLabel(condition) {
        let url = `/get/byConditionLabel/${condition}`;
        let description = `Fetching team(s) with condition: ${condition}`;
        this.apiGet(url, description);
    }

    getByContext(condition, block) {
        let url = `/get/byContext/${condition}/${block}`
        let description = `Fetching team(s) with condition: ${condition} and block: ${block}`;
        this.apiGet(url, description);
    }

    getByProfileId(profileId) {
        let url = `/get/byProfileId/${profileId}`;
        let description = `Fetching team(s) with userProfile: ${profileId}`;
        this.apiGet(url, description);
    }
}

module.exports = TeamWrapper;