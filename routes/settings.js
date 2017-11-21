const   express     = require('express'),
        router      = express.Router(),
        mongoose    = require('mongoose'),
        checkuser   = require('../middleware/auth'),
        User        = mongoose.model('user');

router.get('/settings', checkuser, (req, res) => {
    res.render('settings', { state: req.user.state, city: req.user.city });
});



router.post('/settings',checkuser, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        state: req.body.state,
        city: req.body.city
    })
        .then(() => {
            req.flash('success', 'Your preferences have been updated!');
            res.redirect('/settings');
        })
});

router.post('/changepassword', checkuser, (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            user.changePassword(req.body.currentpass.trim(), req.body.newpass.trim(), (error, result) => {
                if (error) {
                    req.flash('error', error.message);
                    res.redirect('/settings');
                } else {
                    req.flash('success', 'Your password has been updated');
                    res.redirect('/settings');
                }
            })
        })
});

module.exports = router;