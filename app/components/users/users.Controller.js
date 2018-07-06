const mongoose           = require("mongoose");
const { _generateToken } = require("../../utils/func.utils")
const User               = mongoose.model(require("./users.Seed").modelName);

const getAll = (req, res) => {
    User.find().exec((err, docs) => {
        if (err) {
            return res.status(404).json({
                message: "Not found"
            })
        }
        res.status(200).json({
            data: docs
        })
    })
}

const afterLogin = (req, res) => {
    const user = {
        ...req.user,
        avatar: `${req.get('host')}/images/avatars/${req.user.avatar}`
    }
    res.status(200).json({
        token: _generateToken(user),
    })
}

module.exports = {
    getAll,
    afterLogin
}