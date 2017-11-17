const BaseWrapper = require('./base-wrapper');

class ScheduleWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/schedule';
  }

  listAll() {
    const self = this;
    self.logger.info('Fetching a list of all schedules...');
    return self.get('/get')
      .then(response => {
        let schedules = JSON.parse(response).data;
        self.logger.info(schedules);
        return schedules;
      })
      .catch(e => {
        self.logger.error(e);
      })
    ;
  }
}

module.exports = ScheduleWrapper;