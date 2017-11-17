class BaseModel {
  constructor(params) {
    const { logger } = params;
    this.logger = logger || 
    {
      info:(out)=>{console.log(out)},
      error:(out)=>{console.error(out)}
    };    
  }

  /*
   * Override below functions
   */
  
  query() {
    self.logger.error(
      `${this.constructor} but does not override the query() method!`
    );
  }

  findRecord() {
    self.logger.error(
      `${this.constructor} but does not override the findRecord() method!`
    );
  }

  findAll() {
    self.logger.error(
      `${this.constructor} but does not override the findAll() method!`
    );
  }

  save() {
    self.logger.error(
      `${this.constructor} but does not override the save() method!`
    );
  }
}

module.exports = BaseModel;
