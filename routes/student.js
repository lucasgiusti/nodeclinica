
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account");
    userRoute = require("./user");
//************************************************************


var UserModel = userRoute.UserModel;

var getStudentsAll = function (req, res) {
    var type = 'ALUNO';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({name: 1}).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getStudentsByName = function (req, res) {
    var name = req.params.name;
    var type = 'ALUNO';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getStudentsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    var type = 'ALUNO';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getStudentsByRegistration = function (req, res) {
    var registration = req.params.registration;
    var type = 'ALUNO';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getStudentsById = function (req, res) {
    var id = req.params.id;
    UserModel = userRoute.UserModel;
    return UserModel.findById(id, {
        _id: 1,
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        registration: 1,
        phone1: 1,
        active: 1,
        rg: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        type: 1,
        dateInclusion: 1,
        dateUpdate: 1
    }, function (err, users) {
        if (!err) {
            return res.send(users);

        } else {
            return console.log(err);
        }
    });
};

var getStudentsActive = function (req, res) {
    var type = 'ALUNO';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'active': true, 'type': type }, { _id: 1, name: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var putStudent = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (userRoute.validateUser(res, user)) {
            userRoute.putUser(res, user, id);
        }
    }
};

var delStudent = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        userRoute.delUser(res, req, id);
    }
};

var postStudent = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (userRoute.validateUser(res, user)) {
            userRoute.postUser(res, user);
        }
    }
};

module.exports.getStudentsAll = getStudentsAll;
module.exports.getStudentsByName = getStudentsByName;
module.exports.getStudentsByCpf = getStudentsByCpf;
module.exports.getStudentsByRegistration = getStudentsByRegistration;
module.exports.getStudentsById = getStudentsById;
module.exports.getStudentsActive = getStudentsActive;
module.exports.putStudent = putStudent;
module.exports.delStudent = delStudent;
module.exports.postStudent = postStudent;