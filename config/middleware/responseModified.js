/**
 * Modify response to use res.success and res.error
 */

module.exports = (req, res, next) => {
    res.success = (data, message = "Successful!") => {
        res.status(200).json({
            data: data || null,
            message: message,
            success: 1 
        })
    }
    
    res.error = (errors = ["Server error!"]) => {
        res.status(500).json({
            errors: errors,
            success: 0
        })
    }

    next();
}