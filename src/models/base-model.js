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
  

  // We can specify which endpoint to call in the query like this:
  // { byIds: "1,2,3" }
  query() {
    this.logger.error(
      `${this.constructor.name} extends BaseModel but does not override the query() method!`
    );
  }

  findRecord() {
    this.logger.error(
      `${this.constructor.name} extends BaseModel but does not override the findRecord() method!`
    );
  }

  findAll() {
    this.logger.error(
      `${this.constructor.name} extends BaseModel but does not override the findAll() method!`
    );
  }

  save() {
    this.logger.error(
      `${this.constructor.name} extends BaseModel but does not override the save() method!`
    );
  }
}

module.exports = BaseModel;
