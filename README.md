# Overview

This node.js module is meant to provide three things: 
1. A library of models (UserProfile, Team, Schedule, Report, Problem) which can be used to easily interact with the createbetterreasoning T&E API.
1. A series of mocha tests that report the state of the API. 
1. A series of mocha tests showing how to use the provided models to play out some common workflow patterns typically used by performers.

## Models Currently Implemented
- [x] UserProfile
- [x] Team
- [X] Schedule
- [X] Report
- [X] Problem

## Requirements
- Node: v7.10 up to v8.8.1 (**note version 8.9.1 is not supported**)
- Npm: v3.10.x up to v5.5.1
- The tests are confirmed to work using node v8.5.0 (npm v5.3.0)

## Install
First make sure you've installed Node.js, then run: \
`npm install -g mocha` \
`git clone https://github.com/CREATE-TE/cos_app` \
`cd path/to/repo/` \
`npm install`

## Usage
All models can be imported from the 'src/models' directory. For example: \
`const { UserProfile } = require('./src/models');`

Models provide functions used for easily interacting with the API. \
All models implement the same functions:
```
// Use query() to fetch a list of records 
UserProfile.query({byConditionLabel: 'bard'}) // Returns a promise resolving to an array of UserProfile instances.
  .then(userModels => {       
    // do something using userModels array
  })
;
```

```
// Use findRecord() to fetch a single record by id
UserProfile.findRecord('12345abcde') // Returns a promise resolving to a UserProfile instance.
  .then(userModel => {
    // do something with userModel here
  })
  .catch(e => {
    // handle user not found
  })
;
```

```
// Use get() to read the model's data
let userName = userModel.get('userName');
console.log(userName);  
```

```
// Use set(), and save() to save the state of the model back to the API
userModel.set('lastActive.bard', Date.now()); // setting last active for bard
userModel.set('trainedOn.bard', true);        // setting trained on bard to true

userModel.save();  // Saves lastActive and trainedOn states to the API
```

## Running the Tests
To run unit tests for all API endpoints on dev-www.createbetterreasoning.com: \
`npm run dev-api` 

For running tests against the API endpoints on www.createbetterreasoning.com: \
`npm run prod-api`

## Generating test reports:
You can generate the test reports as a CSV document by running: \
`npm run prod-generate-csv` \
`npm run dev-generate-csv`

## Running the Workflows
The workflows require additional python libraries to execute T&E's validation script. \
It is recommended the following steps are done prior to running workflow steps:
1. `virtualenv env` (setup a virtual environment for python 2.7)
1. `source env/bin/activate` (enter python virtual env)
1. `pip install -r requirements.txt` (install all dependencies for T&E's validation script)
1. Now you should be able to run the workflow tests

`npm run dev-workflows` \
`npm run prod-workflows`

