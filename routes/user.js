const   express = require('express'),
        router  = express.Router(),
        mongoose= require('mongoose'),
        Book    = mongoose.model('book'),
        User    = mongoose.model('user');

router.get('/mybooks', checkuser, (req, res) => {
    User.findById(req.user._id)
        .populate({
            path: 'books',
            model: 'book'
        })
        .then(user => {
           res.render('mybooks', { books: user.books })
        });
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

router.delete('/mybooks/:id', (req, res) => {
    const q1 = Book.findByIdAndRemove(req.params.id);
    const q2 = User.findByIdAndUpdate(req.user._id, {
        $pull: { books: mongoose.Types.ObjectId(req.params.id) }
    });
    Promise.all([q1, q2])
        .then(() => {
            res.send({ success: 'The book was successfully deleted'});
        })
        .catch(err => res.send({ error: err.message }));
});

router.get('/settings',checkuser, (req, res) => {
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

function checkuser(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Please log in to access your page');
        res.redirect('/login');
    }
}

module.exports = router;