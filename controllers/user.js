const User = require('mongoose').model('User');
const encryption = require('../utilities/encryption');

module.exports.registerGet = (req, res) => {
    res.render('user/register');
}

module.exports.registerPost = (req, res) => {
    let user = req.body;

    if (user.password && user.password !== user.confirmedPassword) {
        let error = 'Passwords do not match.';

        res.render('user/register', {
            error
        });

        return;
    }

    let salt = encryption.generateSalt();
    user.salt = salt;

    if (user.password) {
        let hashedPassword = encryption.generateHashedPassword(salt, user.password);
        user.password = hashedPassword;
    }

    User
        .create(user)
        .then(user => {
            req.logIn(user, (error, user) => {
                if (error) {
                    res.render('user/register', {
                        error: 'Authentication not working!'
                    });

                    return;
                }

                res.redirect('/');
            });
    });
}