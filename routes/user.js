const   express     = require('express'),
        router      = express.Router(),
        checkuser   = require('../middleware/auth'),
        mongoose    = require('mongoose'),
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


// Requesting for a book 📕
router.post('/books/:id', checkuser, (req, res) => {
    Book.findByIdAndUpdate(req.params.id,
        {
            requested: true,
            requestedby: { user: req.user._id }
        })
        .then(() => {
            User.findByIdAndUpdate(req.user._id, {
                requested: {
                    book: mongoose.Types.ObjectId(req.params.id)
                }
            })
                .then(() => {
                    res.send({ success: 'Book requested' })
                })
        })
});


module.exports = router;