const   express = require('express'),
        router  = express.Router(),
        mongoose= require('mongoose'),
        Book    = mongoose.model('book'),
        User    = mongoose.model('user');

router.get('/mybooks', checkuser, (req, res) => {
   res.render('mybooks');
});

router.get('/mybooks/add', checkuser, (req, res) => {
    let q = req.query.q;
    // ⚔️⚔️⚔ ****************************
    // TODO: Change the test data
    const serverResponse = require('../data/books.json')['items'];
    const books = serverResponse.map(x => {
        return {
            title: x.volumeInfo.title,
            authors: x.volumeInfo.authors,
            description: x.volumeInfo.description,
            imgurl: x.volumeInfo.imageLinks.thumbnail
        }
    });
    // ⚔️⚔️⚔ ****************************
    let data;
    if (q) {
        data = { books, q }
    } else {
        data = { books: undefined, q: '' }
    }
    res.render('addbooks', data);
});

router.post('/mybooks/add', checkuser, (req, res) => {
    let newBook = Book(req.body);
    newBook.save()
        .then(book => {
            User.findByIdAndUpdate(req.user._id, {
                $push: { books: book._id }
            })
                .then(() => res.send({ success: 'Book saved' }));
        });
});

router.get('/settings',checkuser, (req, res) => {
   res.render('settings');
});

function checkuser(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Please log in to access your page');
        res.redirect('/login');
    }
}

module.exports = router;