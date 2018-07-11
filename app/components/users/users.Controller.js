// Import libraries
const mongoose = require("mongoose");
const { wrap: async } = require("co");
const only = require("only");

// Import from our source
const { _generateToken, modifyUser }     = require("../../utils/func.utils")
const { _vldUserRegister, _vldUserEdit } = require("../../utils/validation");

const User = mongoose.model(require("./users.Seed").modelName);

// Varibable


/**
 * Load user data when route have _id param
 */

const load = async (req, res, next, _id) => {
    try {
        const options = {
            criteria: {
                _id,
            }
        }
        req.profile = await User.load(options);
        if (!req.profile) return next(new Error("User not found"));
    } catch (er) {
        return next(er);
    }
    next();
}

/**
 * Get all users in database
 * @requires authentication
 */

const getAll = (req, res) => {
    User.find().exec((err, docs) => {
        if (err) {
            return res.error(err);
        }
        res.success(docs);
    })
}

/**
 * Get user by user _id
 */

const getOneById = (req, res) => {
    res.success(modifyUser(req.profile.toJSON()));
}

/**
 * Create new user
 */
const addOne = async (req, res) => {
    if (!req.file) return res.error("Please post correctly form data!");

    const user = new User({
        username: req.body.username,
        role: req.body.role || '2',
        fullname: req.body.fullname,
        avatar: req.file.filename
    });

    try {
        user.hashed_password = await User.encryptPassword(req.body.password);
        await user.save();
        res.success(user.toJSON());
    } catch(er) {
        res.error(er);
    }
}
/**
 *  We have 3 validations: normal form, type file and check the same username 
 */
const validateUser = (data, file) => new Promise(async (resolve, reject) => {
    // Validate normal form
    const {
        isValid,
        errors
    } = _vldUserRegister(data);
    if (!isValid) return reject(errors);
    
    // Validate file type of avatar 
    if (!~file.mimetype.indexOf('image')) {
        return reject("File avatar must be an image");
    }

    // Validate the same account
    const isAvailableUser = await User.isAvailableUser(data.username);
    if (!isAvailableUser) {
        return reject({ username: "Username is available" })
    }

    resolve();
});

/**
 * Edit user by their _id
 * body required { username, fullname, role }
 * body option { password }
 * 
 */
const editOneById = async (req, res) => {
    try {
        // Check normal form
        const {
            isValid,
            errors
        } = _vldUserEdit({ ...req.body });
        if (!isValid) return res.error(errors);

        // Check the same username with other account
        const isAvailableUser = await User.isAvailableUser(req.body.username);
        if (!isAvailableUser && req.body.username !== req.profile.username) {
            throw new Error("Username is available");
        }

        // Password is changed if the body contain password
        if (req.body.password) {
            req.profile.hashed_password = await User.encryptPassword(req.body.password);
        }
        
        // Assign new data for user
        Object.assign(req.profile, only(req.body, 'username fullname role'));

        // Save
        await req.profile.save(); 
        res.success(req.profile.toJSON());

    } catch (er) {
        res.error(er.message);
    }
}


/**
 * After login success, it will response to client a token
 */

const afterLogin = (req, res) => {
    const data = {
        token:  _generateToken(modifyUser(req.user))
    }
    res.success(data);
}


module.exports = {
    getAll,
    afterLogin,
    getOneById,
    addOne,
    editOneById,
    load,
    validateUser
}