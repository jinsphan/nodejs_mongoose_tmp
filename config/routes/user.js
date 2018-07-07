const path     = require('path');
const router   = require('express').Router();
const passport = require('passport');
const config   = require('../index');

const { authExpressJwt, checkTokenExpiry } = require('../middleware');
const auth = [authExpressJwt, checkTokenExpiry];

const passportLogin = passport.authenticate('local', {session: false});

const userCtrl = require(path.join(config.ROOT, 'app/components/users/users.Controller'));

// router.get('/check-token-expire', ...auth, userCtrl.refreshToken)
router.post('/login', passportLogin, userCtrl.afterLogin);
router.post('/', userCtrl.addOne);
router.get('/', ...auth, userCtrl.getAll);
router.get('/:_id', ...auth, userCtrl.getOneById);

router.param('_id', userCtrl.load);
// router.delete('/:id', ...auth, userCtrl.delOneById);


module.exports = router;