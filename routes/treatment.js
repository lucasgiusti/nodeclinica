
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    patientRoute = require("./patient"),
    utilRoute = require("./util");
//************************************************************

var getTreatmentsAll = function (req, res) {
    var idPatient = req.params.idPatient;
    return patientRoute.PatientModel.findById(idPatient, { _id: 1, name: 1, treatments: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

module.exports.getTreatmentsAll = getTreatmentsAll;