# Overview

This node.js module is meant to provide three things: 
1. A library of models (UserProfile, Team, Schedule, Report, Problem) which can be used to easily interact with the createbetterreasoning T&E API.
1. A series of mocha tests that report the state of the API. 
1. A series of mocha tests showing how to use the provided models to play out some common workflow patterns typically used by performers.

## Models Implemented
- [x] UserProfile
- [x] Team
- [X] Schedule
- [X] Report
- [X] Problem
- [X] UserCommitment

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
## Prepare your Testing Environment
Perform the following sequence of steps to ensure that all endpoints are available for testing:
1. Successfully log into either https://www.createbetterreasoning.com or https://dev-www.createbetterreasoning.com using valid user credentials in your browser.
2. Open your browser's development console and locate the cookie provided for your current session. The cookie should appear similar to the following `JSESSIONID=F521D63500CD3F7C38B5990F462E21D8`.
3. Copy and paste the above cookie value to the first line of the file `token.txt` located at the root of this project.
4. Proceed to run any tests described below.

## API Authentication
The API is not accessible unless you authenticate prior to making requests. To successfully authenticate, first create a local settings file in the config directory for the environment you wish to run (e.g. config/local-dev.json). Next, place your Performer username and password that was provided to you in the local settings file (e.g. {"user":"<username>", "pass":"<password>"} ). You may receive a `401` error response if this step is not performed.

## Running the Tests
To run unit tests for all API endpoints on dev-www.createbetterreasoning.com: \
`npm run dev-api` 

For running tests against the API endpoints on www.createbetterreasoning.com: \
`npm run prod-api`

## Stress Testing the API
To begin stress testing the system, there are two scripts that first need to be ran. The first will take as input a CSV file containing the tasks to execute against the API. (See /stress_test/mock_input.csv for an example). That file is then used to generate a task distribution, where each task is assigned a time delta according to a Poisson distribution. \
The second script will take as input the generated CSV of the first script and spawn a multi-threaded cluster of nodes which will execute tasks concurrently to simulate real user activity. Each node (or thread) targets a specific performer system. 

1. First Generate the Poisson distribution CSV file: \
`npm run gen-stress-csv /path/to/input.csv`\
Optionally, specify the total time interval in seconds that the events should be distributed across: \
`npm run gen-stress-csv -- --seconds 90 /path/to/input.csv`
1. Second Run the stress test. Set the TASKS_FILE to the path of the output file from the first script: \
`TASKS_FILE=/path/to/events_distribution.csv npm run dev-stress`

## Generating test reports:
You can generate the test reports as a CSV document by running: \
`npm run prod-generate-csv` \
`npm run dev-generate-csv` \
`npm run cos-generate-csv` 

## Running the Workflows
The workflows require additional python libraries to execute T&E's validation script. \
It is recommended the following steps are done prior to running workflow steps:
1. install virtualenv using your OS package manager (ex. `apt-get install virtualenv`)
1. `virtualenv tenv` (setup a virtual environment for python 2.7)
1. `source tenv/bin/activate` (enter python virtual env)
1. `pip install -r requirements.txt` (install all dependencies for T&E's validation script)
1. Now you should be able to run the workflow tests

`npm run dev-workflows` \
`npm run prod-workflows` \
`npm run cos-workflows`

