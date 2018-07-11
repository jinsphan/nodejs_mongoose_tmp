const only = require('only');

const user = {
    name: "tinh",
    age: 21
}

const body = {
    name: "tinh1",
    age: 22
}

const _user = only(body, 'name');

Object.assign(user, _user);

_user.name = "ASDF";

console.log(user);