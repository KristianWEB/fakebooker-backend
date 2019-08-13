# Backend

This is the root repo for backend.

## Prerequisites before running

* Install node and npm
* Install mongodb and make sure its running as a service

## How to run?

* Git clone this project
* Open it in vscode or navigate to this directory from any terminal of your choice.
* Run `npm i`
* Goto `config/database-sample.js` and make a copy of this and change the filename to `database.js`
* In the same `database.js` file, make sure that your mongodb url or port is right (i.e., check that `27017` is the port where your mongodb is running unless you have to replace the entire url in case your mongodb is hosted somewhere other than localhost)
* Now go to terminal and run `npm start` and use postman to test the endpoints.

**Note**: API documentations regarding endpoints, their schemas etc are coming soon.
