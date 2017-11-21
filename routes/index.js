const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        User        = require('../models/user'),
        Book        = require('../models/book');

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
        if (err) { res.send({ error: err.message }) }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/');
        });
    });
});

router.post('/login', passport.authenticate('local', {
    successFlash: 'Welcome to Stork Books',
    failureFlash: 'Invalid email or password',
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/books', (req, res) => {
    let page = +req.query.page || 1;
    // 🤨 Double checking for NaN here
    if (typeof page === 'number'&& isNaN(page)) {
        res.send({ error: 'Invalid page' })
    } else {
        const query = Book.find({})
        // 👌 if the page no is one, there is no skip
            .skip((page - 1) * 10)
            .limit(10);

        const count = Book.find({})
            .count();

        Promise.all([query, count])
            .then(result => {
                res.render('books', {
                    books: result[0],
                    pages: Math.ceil(result[1] / 10),
                    currentPage: page
                })
            })
            .catch(err => {
                res.render({ error: err.message });
            })
    }
});

router.get('/logout', (req, res) => {
   req.logout();
   res.redirect('/');
});

module.exports = router;