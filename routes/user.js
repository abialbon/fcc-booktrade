const   express     = require('express'),
        router      = express.Router(),
        checkuser   = require('../middleware/auth'),
        mongoose    = require('mongoose'),
        request     = require('superagent'),
        Book        = mongoose.model('book'),
        User        = mongoose.model('user');

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

// Form to add a book 📕
router.get('/mybooks/add', (req, res) => {
    let q = req.query.q;
    let data;
    if (q) {
        let url = `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process.env.GOOG_API_KEY}`;
        request
            .get(url)
            .end((err, response) => {
                if (err) console.log(err.message);
                const serverResponse = response.body.items;
                const books = serverResponse.map(x => {
                    return {
                        title: x.volumeInfo.title || '',
                        authors: x.volumeInfo.authors || '',
                        description: x.volumeInfo.description || '',
                        imgurl: x.volumeInfo.imageLinks ? x.volumeInfo.imageLinks.thumbnail : ''
                    }
                });
                data = {books, q};
                res.render('addbooks', data);
            })
    } else {
        data = { books: undefined, q: '' };
        res.render('addbooks', data);
    }
});

// Endpoint to add the book 📕
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

router.delete('/mybooks/:id', checkuser, (req, res) => {
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

// See the user's requests
router.get('/myrequests', checkuser, (req, res) => {
    User.findById(req.user._id)
        .populate({
            path: 'requested.book',
            model: 'book'
        })
        .then(user => {
            res.render('myrequests', { books: user.requested })
        })
});

//See who's made requests to me
router.get('/requests', checkuser, (req, res) => {
    User.findById(req.user._id)
        .populate({
            path: 'books',
            model: 'book'
        })
        .then(user => {
            let requestedBooks = user.books.filter(x => x.requested === true);
            res.render('requests', { books: requestedBooks })
        })
});

// Requesting for a book 📕
router.post('/books/:id', checkuser, (req, res) => {
    Book.findByIdAndUpdate(req.params.id,
        {
            requested: true,
            requestedby: {
                user: req.user._id,
                name: req.user.name
            }
        })
        .then(() => {
            User.findByIdAndUpdate(req.user._id, {
                $push: {
                    requested: {
                        book: mongoose.Types.ObjectId(req.params.id),
                        date: new Date()
                    }
                }
            })
                .then(() => {
                    res.send({ success: 'Book requested' })
                })
                .catch(e => console.log('Error here', e.message))
        })
        .catch(e => console.log(e.message))
});


module.exports = router;