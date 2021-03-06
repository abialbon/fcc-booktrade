const   mongoose                = require('mongoose'),
        passportLocalMongoose   = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    books: [mongoose.Schema.Types.ObjectId],
    requested: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'book'
        },
        status: {
            type: String,
            default: 'pending'
        },
        date: {
            type: Date,
            default: new Date()
        }
    }],
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports =  mongoose.model('user', userSchema);