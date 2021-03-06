﻿
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    userRoute = require("./user");
//************************************************************


var UserModel = userRoute.UserModel;

var getManagersAll = function (req, res) {
    var type = 'GESTOR';

    return userRoute.UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getManagersByName = function (req, res) {
    var name = req.params.name;
    var type = 'GESTOR';

    return userRoute.UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getManagersByCpf = function (req, res) {
    var cpf = req.params.cpf;
    var type = 'GESTOR';

    return userRoute.UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getManagersByRegistration = function (req, res) {
    var registration = req.params.registration;
    var type = 'GESTOR';

    return userRoute.UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getManagersById = function (req, res) {
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

var putManager = function (req, res) {
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

var delManager = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        userRoute.delUser(res, req, id);
    }
};

var postManager = function (req, res) {
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

module.exports.getManagersAll = getManagersAll;
module.exports.getManagersByName = getManagersByName;
module.exports.getManagersByCpf = getManagersByCpf;
module.exports.getManagersByRegistration = getManagersByRegistration;
module.exports.getManagersById = getManagersById;
module.exports.putManager = putManager;
module.exports.delManager = delManager;
module.exports.postManager = postManager;