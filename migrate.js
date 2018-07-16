'use strict';

require('dotenv').config();
const path     = require('path');
const mongoose = require('mongoose');
const config   = require('./config');
const models   = ['users'];

models
    .map(getPathModel)
    .forEach(require);

function getPathModel(model) {
    return path.join(config.ROOT, `app/components/${model}/${model}.Model`);
}

function getPathSeed(model) {
    return path.join(config.ROOT, `app/components/${model}/${model}.Seed`);
}

function deleteAllDocs(xModel, cb) {
    let countDone = 0;
    xModel.remove({}, (er) => {
        if (!er) {
            console.log("Delete all data from " + xModel.modelName + " model");
            countDone++;
            if (models.length === countDone) {
                setTimeout(() => {
                    cb(null);
                }, 1500);
            }
        } else {
            cb("Can not delete data from " + xModel.modelName + " model");
        }
    })
}

function addDocuments(xModel, seed, cb) {
    xModel.insertMany(seed, (err, docs) => {
        if(err) return cb(err);
        console.log("Added all documents for " + xModel.modelName + " model");
        cb(null);
    })
}

function runMigrate(type) {
    return new Promise((resolve, reject) => {
        models
        .map(getPathSeed)
        .forEach((path) => {
            const { seed, modelName } = require(path);
            const xModel = mongoose.model(modelName);
            switch(type) {
                case 'roll-back': {
                    deleteAllDocs(xModel, handleError);
                    break;
                }
                case 'add-documents': {
                    addDocuments(xModel, seed, handleError);
                    break;
                }
                default: return false;
            }
        })

        function handleError(er) {
            if (!er) return resolve();
            reject(er);
        }
        
    })
}
    
const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.DB.MONGOOSE_URL);
        const db = mongoose.connection;
        db.on('error', () => reject('Please start mongodb service: sudo service mongod start'));
        db.once('open', resolve)
    })
}

connect()
    .then(runMigrate.bind(null, 'roll-back'))
    .then(runMigrate.bind(null, 'add-documents'))
    .then(() => {
        console.log("Done");
        process.exit(0);
    })
    .catch(er => {
        console.log(JSON.stringify(er, null, 2));
        process.exit(1);
    })