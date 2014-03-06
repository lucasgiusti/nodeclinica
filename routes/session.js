
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




var validateSession = function (res, treatment) {

    if (treatment.serviceArea == null) {
        console.log('Error adding treatment: area de atendimento invalida');
        res.send('500', { status: 500, error: 'Area de atendimento invalida' });
        return false;
    }

    if ((treatment.diagnosis == null) || (treatment.diagnosis != null && !iz.between(treatment.diagnosis.length, 1, 3000))) {
        console.log('Error adding treatment: o diagnostico deve ter 1 a 3000 caracteres');
        res.send('500', { status: 500, error: 'O diagnostico deve ter 1 a 3000 caracteres' });
        return false;
    }

    if ((treatment.doctor == null) || (treatment.doctor != null && !iz.between(treatment.doctor.length, 1, 100))) {
        console.log('Error adding treatment: o nome do medico deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome do medico deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((treatment.CRMDoctor == null) || (treatment.CRMDoctor != null && !iz.between(treatment.CRMDoctor.length, 1, 20))) {
        console.log('Error adding treatment: o CRM do medico deve ter 1 a 20 caracteres');
        res.send('500', { status: 500, error: 'O CRM do medico deve ter 1 a 20 caracteres' });
        return false;
    }

    if (treatment.status == null) {
        console.log('Error adding treatment: situacao invalida');
        res.send('500', { status: 500, error: 'Situacao invalida' });
        return false;
    }

    if (!iz.maxLength(treatment.observations, 3000)) {
        console.log('Error adding treatment: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }

    if (!iz(treatment.dateInclusion).required().date().valid) {
        console.log('Error adding treatment: data de inclusao invalida');
        res.send('500', { status: 500, error: 'Data de inclusao invalida' });
        return false;
    }

    return true;
}

var getSessionsAll = function (req, res) {
    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    return patientRoute.PatientModel.findOne({ '_id': idPatient, 'treatments._id': idTreatment }, { _id: 1, name: 1, 'treatments.$': 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var postSession = function (req, res) {

    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {

        var idPatient = req.params.idPatient;
        var idTreatment = req.params.idTreatment;
        var session = req.body;
        
        for (i = 0; i <= 23; i++) {
            delete session[i];
        }
        console.log(session);

        console.log('Adding session');
        session.dateInclusion = new Date();

        if (validateSession(res, session)) {

            PatientModel = mongoose.model('patients', patientRoute.Patient);
            PatientModel.findOne({ '_id': idPatient, 'treatments._id': idTreatment }, function (err, patient) {
                if (!err) {
                    if (patient) {

                        delete session._id;
                        session.idTreatment = idTreatment;

                        patient.treatments.sessions.push(session);

                        patient.save(function (err, result) {
                            if (err) {
                                console.log('Error updating session: ' + err);
                                res.send('500', { status: 500, error: err });
                            } else {
                                console.log('document(s) updated');
                                res.send(patient.treatments[patient.treatments.length - 1].sessions[patient.treatments.sessions.length - 1]);
                            }
                        });
                    }
                }
                else {
                    console.log(err);
                    res.send('500', { status: 500, error: err });
                }

            });
        }
    }
}


module.exports.getSessionsAll = getSessionsAll;
module.exports.postSession = postSession;