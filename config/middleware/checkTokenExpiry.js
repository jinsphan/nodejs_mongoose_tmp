var checkTokenExpiry = (req, res, next) => {
    var expiry = req.userAuth.exp;
    var expiried = (new Date().getTime()) - expiry;
    if (expiried > 0) {
        return res.status(401).json({"error": "The token has expiried"});
    }
    next();
}

module.exports = checkTokenExpiry;