const mongoose = require('mongoose');

module.exports.connect = (db_URL) => {
    mongoose.connect(db_URL, { useMongoClient: true });

    mongoose.Promise = global.Promise;

    mongoose.connection
        .once('open', () => {
            console.log('Connection to the database is established');
            mongoose.Promise = global.Promise;
            require('./user');
            require('./book');
        })
        .on('error', () => process.exit(1));
};