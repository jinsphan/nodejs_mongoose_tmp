const path     = require('path');
const router   = require('express').Router();
const passport = require('passport');
const multer   = require('multer');

const config                               = require('../index');
const { authExpressJwt, checkTokenExpiry } = require('../middleware');
const userCtrl                             = require(path.join(config.ROOT, 'app/components/users/users.Controller'));

const auth = [authExpressJwt, checkTokenExpiry];
const passportLogin = passport.authenticate('local', {session: false});
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
        cb(null, config.ROOT + '/assets/images/avatars/')
	},
	filename: (req, file, cb) => {
	    cb(null, file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]);
	}
});

const upload = multer({
    fileFilter: function(req, file, cb) {
        /**
         * When you make a form-data to upload file,
         * please make sure all text fields place at above file is uploaded
         */
        
        userCtrl.validateUser(req.body, file)
        .then(() => cb(null, true))
        .catch(errors => cb({
            message: errors,
        }));
    },
    storage,
});

// router.get('/check-token-expire', ...auth, userCtrl.refreshToken)
router.post('/login', passportLogin, userCtrl.afterLogin);
router.post('/', upload.single('avatar') ,userCtrl.addOne);
router.get('/', ...auth, userCtrl.getAll);
router.get('/:_id', ...auth, userCtrl.getOneById);

router.param('_id', userCtrl.load);
// router.delete('/:id', ...auth, userCtrl.delOneById);


module.exports = router;