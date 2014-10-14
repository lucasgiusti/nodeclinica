﻿
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    userRoute = require("./user"),
    patientRoute = require("./patient");
//************************************************************


var UserModel = userRoute.UserModel;

var getTeachersAll = function (req, res) {
    var type = 'PROFESSOR';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getTeachersByName = function (req, res) {
    var name = req.params.name;
    var type = 'PROFESSOR';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getTeachersByCpf = function (req, res) {
    var cpf = req.params.cpf;
    var type = 'PROFESSOR';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getTeachersByRegistration = function (req, res) {
    var registration = req.params.registration;
    var type = 'PROFESSOR';
    UserModel = userRoute.UserModel;
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var getTeachersById = function (req, res) {
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

var getTeachersActive = function (req, res) {
    var type = 'PROFESSOR';
    return userRoute.UserModel.find({ 'active': true, 'type': type }, { _id: 1, name: 1 }).sort({ name: 1 }).exec(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
};

var putTeacher = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if ( userRoute.validateUser(res, user)) {
            userRoute.putUser(res, user, id);
        }
    }
};

var delTeacher = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.status('401').send({ status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);

        return patientRoute.PatientModel.find({ 'treatments.sessions.teacherId': id }, { _id: 1, name: 1, 'treatments': 1 }, function (err, patients) {
            if (!err) {
                if (patients.length > 0) {
                    console.log('Error deleting teacher: o professor já está vinculado a um atendimento. Só é permitido desativá-lo');
                    res.status('500').send({ status: 500, error: 'O professor já está vinculado a um atendimento. Só é permitido desativá-lo' });
                }
                else {
                    userRoute.delUser(res, req, id);
                }
            } else {
                return console.log(err);
            }
        });
    }
};

var postTeacher = function (req, res) {
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

module.exports.getTeachersAll = getTeachersAll;
module.exports.getTeachersByName = getTeachersByName;
module.exports.getTeachersByCpf = getTeachersByCpf;
module.exports.getTeachersByRegistration = getTeachersByRegistration;
module.exports.getTeachersById = getTeachersById;
module.exports.getTeachersActive = getTeachersActive;
module.exports.putTeacher = putTeacher;
module.exports.delTeacher = delTeacher;
module.exports.postTeacher = postTeacher;