const adminAuth = (req, res, next) => {
    if (req.userAuth.role === 1) next();
    else {
        next(new Error("You are not admin"));
    } 
}

const ownersAuth = (req, res, next) => {
    if (req.profile._id.equals(req.userAuth._id)) next();
    else {
        next(new Error("The _id is not yours"));
    }
}

module.exports = {
    adminAuth,
    ownersAuth
}