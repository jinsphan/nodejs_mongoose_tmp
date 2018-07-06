console.log("test mongoose");

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;

db.on('error', () => {
    console.log("connection error");
});

db.once('open', () => {
    console.log('Mongoose is openning...');
})

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

Kitten.find((err, kittens) => {
    if (err) {
        console.error(err);
    } else {
        console.log(kittens);
    }
})