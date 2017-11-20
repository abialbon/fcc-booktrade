const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/signup', (req, res) => {
   res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/signup', (req, res) => {
    let newUser = {
        email: req.body.email.trim(),
        name: req.body.name.trim()
    };
    User.register(newUser, req.body.password.trim(), (err, user) => {
        if (err) { res.send({ error: err.message }) };
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

router.get('/books', (req, res) => {
   res.render('books');
});

router.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/');
});

module.exports = router;