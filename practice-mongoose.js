const assert = require('assert');

console.log("test mongoose");

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/test');

const db = mongoose.connection;
let isMigrate = true;

db.on('error', () => {
    console.log("connection error");
});

db.once('open', () => {
    console.log('Mongoose is openning...');
})

const userSchema = mongoose.Schema({
    username: String,
    age: Number,
})

const laptopSchema = mongoose.Schema({
    brand: String,
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    color: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("User", userSchema);
const Laptop = mongoose.model("Laptop", laptopSchema);

if (isMigrate) {
    // User.remove().then(() => {
    //     User.insertMany([
    //         { username: 'tinh', age: 22 },
    //         { username: 'giang', age: 22 },
    //     ]).then((res) => {
    //         console.log(res);
    //         process.exit();
    //     }).catch(er => {
    //         console.log(er.message);
    //         process.exit();
    //     })
    // })

    Laptop.remove().then(() => {
        const newlap = new Laptop({
            brand: 'Toyota',
            owner: "5b484ae493038457ac201511",
            // color: "white"
        });

        newlap.save().then(process.exit).catch(er => {
            // console.log(er.errors['color']);
            const err = newlap.validateSync();
            console.log(err.errors['color'].message);
        });
    })

} else {
    Laptop.find()
    .populate('owner')
    .exec((er, res) => {
        console.log(res);
    })
}
