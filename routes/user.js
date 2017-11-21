const   express = require('express'),
        router  = express.Router();
// 🙋‍♂️ TODO: These routes need to be checked for authentication 🔍

router.get('/mybooks', (req, res) => {
   res.render('mybooks');
});

router.get('/mybooks/add', (req, res) => {
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

function checkuser(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Please log in to access your page');
        res.redirect('/login');
    }
}

module.exports = router;