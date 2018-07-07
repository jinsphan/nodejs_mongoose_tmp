const { wrap: async } = require('co');

// const foo = async(function* () {
//     const a = () => {
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 reject("ABCDEF");
//             }, 1000);
//         })
//     }
//     let res;
//     try {
//         res = yield a();
//     } catch (er) {
//         console.log(er);
//     }
//     console.log(res);
// })

const foo = async () => {
    const a = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("ABCDEF");
            }, 1000);
        })
    }

    let ar = [];

    ar.push(a());
    ar.push(a());
    ar.push(a());
    ar.push(a());
    ar.push(a());
    ar.push(a());

    const res = await Promise.all(ar);
    console.log(res);
}

foo();