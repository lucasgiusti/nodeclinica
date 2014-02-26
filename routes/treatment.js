
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

var postTreatment = function (req, res) {

    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var idPatient = req.params.idPatient;
        console.log("[" + idPatient + "]");

        var treatment = req.body;
        console.log('Adding treatment');
        treatment.dateInclusion = new Date();

        if (validateTreatment(res, treatment)) {

            PatientModel = mongoose.model('patients', Patient);
            //INSERT
            delete patient._id;
            delete patient.dateUpdate;
            PatientModel = new PatientModel(patient);
            PatientModel.save(function (err, patient, result) {
                if (err) {
                    console.log('Error inserting patient: ' + err);
                    res.send('500', { status: 500, error: err });
                } else {
                    console.log('' + result + ' document(s) inserted');
                    res.send(patient);
                }
            });
        }
    }
}

module.exports.getTreatmentsAll = getTreatmentsAll;
module.exports.postTreatment = postTreatment;