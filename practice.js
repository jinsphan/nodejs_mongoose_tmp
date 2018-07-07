const { wrap: async } = require("co");

const a = async(function * () {
    const num = yield new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("ABCDEF");
        }, 1500);
    }) 

    console.log(num);
})

a();