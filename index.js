const   express         = require('express'),
        app             = express(),
        path            = require('path'),
        bodyParser      = require('body-parser'),
        flash           = require('connect-flash'),
        mongoose        = require('mongoose'),
        db              = require('./models/index'),
        passport        = require('passport'),
        session         = require('express-session'),
        localStrategy   = require('passport-local').Strategy,
        indexRoutes     = require('./routes/index');

// Database connection
db.connect(process.env.DB_URL);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));



// Passport configuration
const User = require('./models/user');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({
    usernameField: 'email',
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 🚨 Flash middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error')[0];
    next();
});

// 👤 Loading the user on the response locals
app.use((req, res, next) => {
    res.locals.authenticated = !!req.user;
    res.locals.user = req.user;
    next();
});

// Routes
app.use('/', indexRoutes);

app.listen(process.env.PORT, () => {
   console.log('The server is running at http://localhost:' + process.env.PORT);
});