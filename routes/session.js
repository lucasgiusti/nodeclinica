
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




var validateSession = function (res, session) {

    if (session.typeSession == null) {
        console.log('Error adding session: tipo de Sessao invalida');
        res.send('500', { status: 500, error: 'Tipo de Sessao invalida' });
        return false;
    }

    if (session.typeService == null) {
        console.log('Error adding session: modalidade de Atendimento invalida');
        res.send('500', { status: 500, error: 'Modalidade de Atendimento invalida' });
        return false;
    }

    if (session.studentId == null) {
        console.log('Error adding session: aluno invalido');
        res.send('500', { status: 500, error: 'Aluno Invalido' });
        return false;
    }

    if (session.teacherId == null) {
        console.log('Error adding session: professor invalido');
        res.send('500', { status: 500, error: 'Professor Invalido' });
        return false;
    }

    if (!iz.maxLength(session.observations, 3000)) {
        console.log('Error adding session: a observacao deve ter maximo 3000 caracteres');
        res.send('500', { status: 500, error: 'A observacao deve ter maximo 3000 caracteres' });
        return false;
    }


    if (!iz(session.dateSchedulingStart).required().date().valid) {
        console.log('Error adding session: data de Agendamento Inicio invalida');
        res.send('500', { status: 500, error: 'Data de Agendamento Inicio invalida' });
        return false;
    }

    if (!iz(session.dateSchedulingEnd).required().date().valid) {
        console.log('Error adding session: data de Agendamento Inicio invalida');
        res.send('500', { status: 500, error: 'Data de Agendamento Inicio invalida' });
        return false;
    }

    if (!iz(session.dateInclusion).required().date().valid) {
        console.log('Error adding session: data de inclusao invalida');
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

var getSessionsById = function (req, res) {
    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var id = req.params.id;

    var patient = patientRoute.Patient;
    patient._id = idPatient;
    patient.treatment = patientRoute.Treatment;
    patient.treatment._id = idTreatment;

    return patientRoute.PatientModel.findOne({ 'treatments.sessions._id': id }, { _id: 1, name: 1, 'treatments.$': 1 }, function (err, patients) {
        if (!err) {

            for(var i=0;i<patients.treatments[0].sessions.length;i++)
            {
                if (patients.treatments[0].sessions[i]._id != id) {
                    patients.treatments[0].sessions.pull({ _id: patients.treatments[0].sessions[i]._id });
                    i--;
                }
            }

            return res.send(patients.treatments[0].sessions[0]);
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
        console.log('Adding session');
        session.dateInclusion = new Date();

        if (validateSession(res, session)) {

            PatientModel = mongoose.model('patients', patientRoute.Patient);
            PatientModel.findOne({ '_id': idPatient, 'treatments._id': idTreatment }, {_id: 1, 'treatments.$': 1}, function (err, patient) {
                if (!err) {
                    if (patient) {

                        delete session._id;
                        session.idTreatment = idTreatment;
                        patient.treatments[0].sessions.push(session);

                        patient.save(function (err, result) {
                            if (err) {
                                console.log('Error updating session: ' + err);
                                res.send('500', { status: 500, error: err });
                            } else {
                                console.log('document(s) updated');
                                res.send(patient.treatments[0].sessions[patient.treatments[0].sessions.length - 1]);
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

var delSession = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var idPatient = req.params.idPatient;
        var idTreatment = req.params.idTreatment;
        var id = req.params.id;

        console.log('Deleting session: ' + id);

        return patientRoute.PatientModel.findOne({ 'treatments.sessions._id': id }, { _id: 1, name: 1, 'treatments.$': 1 }, function (err, patients) {
            if (!err) {
                if (patients) {
                    patients.treatments[0].sessions.remove(id);
                    patients.save(function () { res.send(patients); });
                }
            }
            else {
                return res.send('500', { status: 500, error: 'Sessao nao encontrada' });
            }
        });
    }
}

var putSession = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {

        var id = req.params.id;
        var session = req.body;
        var idPatient = session.idPatient;

        for (i = 0; i <= 23; i++) {
            delete session[i];
        }

        console.log('Updating treatment');
        session.dateUpdate = new Date();
        var objectID = new ObjectID(id);

        if (validateSession(res, session)) {

            return patientRoute.PatientModel.findOne({ 'treatments.sessions._id': id }, { _id: 1, 'treatments.$': 1 }, function (err, patients) {
                if (!err) {

                    for (var i = 0; i < patients.treatments[0].sessions.length; i++) {
                        if (patients.treatments[0].sessions[i]._id == id) {
                            patients.treatments[0].sessions[i] = session;
                        }
                    }

                    return patientRoute.PatientModel.update({ '_id': idPatient }, patients, { safe: true }, function (err, result) {
                        if (err) {
                            console.log('Error updating session: ' + err);
                            res.send('500', { status: 500, error: err });
                        } else {
                            console.log('' + result + ' document(s) updated');

                            res.send(patient);
                        }
                    });


                } else {
                    console.log('Error updating session: ' + err);
                    res.send('500', { status: 500, error: err });
                }
            });
        }
    }
}

module.exports.getSessionsAll = getSessionsAll;
module.exports.getSessionsById = getSessionsById;
module.exports.postSession = postSession;
module.exports.delSession = delSession;
module.exports.putSession = putSession;