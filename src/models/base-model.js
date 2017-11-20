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
  static query() {
    let error =
      `${this.constructor.name} extends BaseModel but does not override the query() method!`
    ;
    throw new Error(error);
  }

  static findRecord() {
    let error =
      `${this.constructor.name} extends BaseModel but does not override the findRecord() method!`
    ;
    throw new Error(error);
  }

  static findAll() {
    let error =
      `${this.constructor.name} extends BaseModel but does not override the findAll() method!`
    ;
    throw new Error(error);
  }

  get() {
    let error =
    `${this.constructor.name} extends BaseModel but does not override the get() method!`
    ;
    throw new Error(error);
  }

  save() {
    let error =
      `${this.constructor.name} extends BaseModel but does not override the save() method!`
    ;
    throw new Error(error);
  }
}

module.exports = BaseModel;
