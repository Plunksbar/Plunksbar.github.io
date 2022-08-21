const bcrypt = require('bcrypt');

class User {
    constructor() {
        this.username;
        this.Events = [];
    }

    hashPassword(password) {

        var salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt)
        console.log(`password: ${password} \n
                     salt: ${salt} \n
                     hashed password: ${this.password} \n`);
    };
}

module.exports = {User};