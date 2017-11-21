// Checking if the user is authenticated ⚔️⚔

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Please log in to access your page');
        res.redirect('/login');
    }
};