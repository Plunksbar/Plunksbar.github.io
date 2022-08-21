var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Model
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// Database
class DataBase {
    constructor(name, url) {
        this.name = name;
        this.client = MongoClient;
        this.mongoose = mongoose;
        this.url = url;

        mongoose.connect(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => console.log("Connected to DB"))
        .catch (console.error);
    }

    registerUser(username, password) {
        var passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        var usernameFormat = /^[A-Za-z0-9]\w{3,14}$/

        if (password.match(passwordFormat) && username.match(usernameFormat)) {

            var salt = await bcrypt.genSalt(10);
            var pwd = await bcrypt.hash(password, salt)
            console.log(`password: ${password} \n
                         salt: ${salt} \n
                         hashed password: ${pwd} \n`);

            var user = new User();
            user.username = username;
            user.password = pwd;
            user.save().then(console.log('user saved'));
        } else {
            throw 'formatting not correct';
        }

    }

    checkUserCredentials(username, password) {
        const user = await User.findOne({ username: username});
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            return isValid;
        } else {
            throw 'user does not exist'
        };
    };
};

module.exports = {DataBase};