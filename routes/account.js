
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose');

//************************************************************


//************************************************************
var Schema = mongoose.Schema;

//Account Model
var Account = new Schema({
    username: {type: String, index: { unique: true}},
    type: { type: String, required: true },
    dateInclusion: { type: Date, required: true }
});


Account.plugin(passportLocalMongoose);


var AccountModel = mongoose.model('accounts', Account);


passport.use(new LocalStrategy(AccountModel.authenticate()));
passport.serializeUser(AccountModel.serializeUser());
passport.deserializeUser(AccountModel.deserializeUser());

function createAdmUser() {
    AccountModel.find({ 'username': 'admin' }, { _id: 1 }, function (err, acc) {
        if (!err) {
            if (acc == '') {
                AccountModel.register(new AccountModel({ username: 'admin', dateInclusion: new Date(), type: 'ADMIN' }), 'admin', function (err, account) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Admin user created");
                    }
                });
            }
        } else {
            console.log(err);
        }
    });
}

function registerAccount(res, accountNew) {
    AccountModel.register(new AccountModel({ username: accountNew.username, dateInclusion: new Date(), type: accountNew.type }), accountNew.password, function (err, account) {
        if (err) {
            console.log('Error updating account: ' + err);
            res.send('500', { status: 500, error: err });
        }
        else {
            console.log('document(s) updated');
            res.send(account);
        }
    });
}



//************************************************************
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send('401', { status: 401, error: 'Acesso Negado' });
    else
        next();
};

var isAuthorized = function (typeUser, typeAuthorization) {

    if (typeAuthorization == 'MANUTENCAO_CADASTRO') {
        return (typeUser == 'ADMIN' || typeUser == 'GESTOR');
    }
    else {
        return false;
    }
}

var loggedtest = function (req, res) {
    if (req.user)
        res.send({ 'username': req.user.username, 'type': req.user.type });
    else
        res.send('401', { status: 401, error: 'Acesso Negado' });
};

var login = passport.authenticate('local', { successRedirect: '/', failureRedirect: '/signin.html?return=false' });

var logout = function (req, res) {
    req.logout();
    res.redirect('/signin.html');
};

var findByUserName = function (req, res) {
    var username = req.params.username;

    return AccountModel.findOne({ 'username': username }, { _id: 1, username: 1 }, function (err, account) {
        if (!err) {
            return res.send(account);
        } else {
            return console.log(err);
        }
    });
};

var putAccount = function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {

        var id = req.params.id;
        var accountNew = req.body;
        console.log('Updating account: ' + id);

        AccountModel.findOne({ 'username': id }, { _id: 1 }, function (err, account) {
            if (!err) {
                if (account) {
                    account.remove(function () { registerAccount(res, accountNew); });
                }
                else {
                    registerAccount(res, accountNew);
                }

            } else {
                console.log('Error updating account: ' + err);
                res.send('500', { status: 500, error: err });
            }
        });
    }
};
//************************************************************


module.exports.AccountModel = AccountModel;
module.exports.CreateAdmUser = createAdmUser;
module.exports.auth = auth;
module.exports.loggedtest = loggedtest;
module.exports.isAuthorized = isAuthorized;
module.exports.login = login;
module.exports.logout = logout;
module.exports.findByUserName = findByUserName;
module.exports.putAccount = putAccount;