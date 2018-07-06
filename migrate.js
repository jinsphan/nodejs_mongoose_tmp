'use strict';

require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
const models = ['users'];


models
    .map(model => path.join(config.ROOT, `app/components/${model}/${model}.Model`))
    .forEach(require);

const runMigrate = (type) => {
    return new Promise((resolve, reject) => {
        let countDone = 0;
        models
        .map(model => path.join(config.ROOT, `app/components/${model}/${model}.Seed`))
        .forEach((path) => {
            const {
                seed,
                modelName
            } = require(path);
            const xModel = mongoose.model(modelName);
            switch(type) {
                case 'roll-back': {
                    xModel.remove({}, (er) => {
                        if (!er) {
                            console.log("Delete all data from " + modelName + " model");
                            countDone++;
                            if (models.length === countDone) {
                                setTimeout(() => {
                                    resolve();
                                }, 1500);
                            }
                        } else {
                            reject("Can not delete data from " + modelName + " model")
                        }
                    })
                    break;
                }
                case 'add-documents': {
                    xModel.insertMany(seed, (err, docs) => {
                        if(err) return reject(err);
                        console.log("Added all documents");
                        resolve(docs);
                    })
                    break;
                }
                default: return false;
            }
            
        })
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