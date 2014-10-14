
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

var getAttendantsAll = function (req, res) {
    var type = 'ATENDENTE';
    return userRoute.UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getAttendantsByName = function (req, res) {
    var name = req.params.name;
    var type = 'ATENDENTE';
    return userRoute.UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getAttendantsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    var type = 'ATENDENTE';
    return userRoute.UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getAttendantsByRegistration = function (req, res) {
    var registration = req.params.registration;
    var type = 'ATENDENTE';
    return userRoute.UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getAttendantsById = function (req, res) {
    var id = req.params.id;
    return userRoute.UserModel.findById(id, {
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

var putAttendant = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
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

var delAttendant = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        userRoute.delUser(res, req, id);
    }
};

var postAttendant = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
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

module.exports.getAttendantsAll = getAttendantsAll;
module.exports.getAttendantsByName = getAttendantsByName;
module.exports.getAttendantsByCpf = getAttendantsByCpf;
module.exports.getAttendantsByRegistration = getAttendantsByRegistration;
module.exports.getAttendantsById = getAttendantsById;
module.exports.putAttendant = putAttendant;
module.exports.delAttendant = delAttendant;
module.exports.postAttendant = postAttendant;