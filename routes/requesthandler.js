const   express     = require('express'),
        router      = express.Router(),
        checkuser   = require('../middleware/auth'),
        mongoose    = require('mongoose'),
        User        = mongoose.model('user'),
        Book        = mongoose.model('book');

router.post('/approve/:bookid', checkuser, (req, res) => {
    Book.findByIdAndUpdate(req.params.bookid, {
        approved: 'approved'
    })
        .then(book => {
            User.update({ _id: book.requestedby.user, "requested.book": req.params.bookid}, {
                $set: { "requested.$.status": 'approved' }
            })
                .then(() => {
                    res.send({ success: 'Book approved' })
                })
        })
});

router.post('/reject/:bookid', checkuser, (req, res) => {
    Book.findByIdAndUpdate(req.params.bookid, {
        approved: 'rejected',
        requested: false,
        requestedby: []
    })
        .then(book => {
            User.update({ _id: book.requestedby.user, "requested.book": req.params.bookid}, {
                $set: { "requested.$.status": 'rejected' }
            })
                .then(() => {
                    res.send({ success: 'Book rejected' })
                })
        })
});

module.exports = router;