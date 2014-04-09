
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
    if (session.observations != null) { session.observations = session.observations.trim(); }


    if (!iz(session.dateSchedulingStart).required().date().valid) {
        console.log('Error adding session: data de Agendamento Inicio invalida');
        res.send('500', { status: 500, error: 'Data de Agendamento Inicio invalida' });
        return false;
    }

    if (!iz(session.dateSchedulingEnd).required().date().valid) {
        console.log('Error adding session: data de Agendamento Final invalida');
        res.send('500', { status: 500, error: 'Data de Agendamento Final invalida' });
        return false;
    }

    if (session.dateSchedulingEnd <= session.dateSchedulingStart) {
        console.log('Error adding session: data de Agendamento Final invalida');
        res.send('500', { status: 500, error: 'Data de Agendamento Final invalida' });
        return false;
    }

    if (!(session.everHeld == 'true' || session.everHeld == true)) {
        session.everHeld = false;
    }

    if (!(session.canceledSession == 'true' || session.canceledSession == true)) {
        session.canceledSession = false;
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

var getSessionsByType = function (req, res) {
    var id = req.params.id;
    var type = req.params.type;

    if (type == "studentId") {
        return patientRoute.PatientModel.find({ 'treatments.sessions.studentId': id }, { _id: 1, name: 1, 'treatments': 1 }, function (err, patients) {
            if (!err) {


                for (var i = 0; i < patients.length; i++) {

                    if (patients[i].treatments) {
                        for (var j = 0; j < patients[i].treatments.length; j++) {

                            if (patients[i].treatments[j].sessions) {
                                for (var z = 0; z < patients[i].treatments[j].sessions.length; z++) {
                                    if (patients[i].treatments[j].sessions[z].studentId != id) {
                                        patients[i].treatments[j].sessions.pull({ _id: patients[i].treatments[j].sessions[z]._id });
                                        z--;
                                    }
                                }
                            }

                            if (patients[i].treatments[j].sessions.length == 0) {
                                patients[i].treatments.pull({ _id: patients[i].treatments[j]._id });
                                j--;
                            }
                        }

                        if (patients[i].treatments.length == 0) {
                            patients[i].pull({ _id: patients[i]._id });
                            i--;
                        }


                    }

                }


                return res.send(patients);
            } else {
                return console.log(err);
            }
        });
    }
    else {
        return patientRoute.PatientModel.find({ 'treatments.sessions.teacherId': id }, { _id: 1, name: 1, 'treatments.$': 1 }, function (err, patients) {
            if (!err) {
                return res.send(patients);
            } else {
                return console.log(err);
            }
        });
    }
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

        verificaHorario(req, res, addSession);


    }
}

var horarioDisponivelPatient = function (req, res) {

    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var session = req.body;
    var dateStart = new Date(session.dateSchedulingStart);
    var dateEnd = new Date(session.dateSchedulingEnd);
    for (i = 0; i <= 23; i++) {
        delete session[i];
    }

    console.log(idPatient);

    patientRoute.PatientModel.find({ '_id': idPatient, $or: [{ 'treatments.sessions.dateSchedulingStart': { '$gte': dateStart, '$lt': dateEnd } }, { 'treatments.sessions.dateSchedulingEnd': { '$gt': dateStart, '$lte': dateEnd } }] }, { _id: 1, 'treatments': 1 }, function (err, patients) {
        if (!err) {
            if (patients.length > 0) {
                console.log("encontrou paciente");
                for (var i = 0; i < patients.length; i++) {
                    for (var y = 0; y < patients[i].treatments.length; y++) {
                        if (patients[i].treatments[y].treatmentPerformed == false && patients[i].treatments[y].canceledTreatment == false) {
                            console.log("encontrou tratamento");
                            for (var z = 0; z < patients[i].treatments[y].length; z++) {
                                if (patients[i].treatments[y].sessions[z].everHeld == false && patients[i].treatments[y].sessions[z].canceledSession == false) {
                                    console.log("encontrou sessao");
                                    console.log(dateStart);
                                    console.log(patients[i].treatments[y].sessions[z].dateSchedulingStart);
                                    console.log(dateEnd);
                                    console.log(patients[i].treatments[y].sessions[z].dateSchedulingEnd);
                                    if ((patients[i].treatments[y].sessions[z].dateSchedulingStart >= dateStart && patients[i].treatments[y].sessions[z].dateSchedulingStart < dateEnd) ||
                                        (patients[i].treatments[y].sessions[z].dateSchedulingEnd > dateStart && patients[i].treatments[y].sessions[z].dateSchedulingEnd <= dateEnd)) {

                                        console.log('Error adding session: o paciente selecionado já possui agenda para este horário');
                                        res.send('500', { status: 500, error: 'O paciente selecionado já possui agenda para este horário' });
                                        return false;
                                    }

                                }
                            }
                        }
                    }
                }

                return true;
            }
            else {

                return true;
            }
        }
        else {
            console.log(err);
            res.send('500', { status: 500, error: err });
        }
        

    });
}

var horarioDisponivelTeacher = function (req, res) {

    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var session = req.body;
    var dateStart = new Date(session.dateSchedulingStart);
    var dateEnd = new Date(session.dateSchedulingEnd);
    for (i = 0; i <= 23; i++) {
        delete session[i];
    }

    patientRoute.PatientModel.find({ 'treatments.sessions.teacherId': session.teacherId, $or: [{ 'treatments.sessions.dateSchedulingStart': { '$gte': dateStart, '$lt': dateEnd } }, { 'treatments.sessions.dateSchedulingEnd': { '$gt': dateStart, '$lte': dateEnd } }] }, { _id: 1, 'treatments': 1 }, function (err, patients) {
        if (!err) {
            if (patients.length > 0) {

                for (var i = 0; i < patients.length; i++) {
                    for (var y = 0; y < patients[i].treatments.length; y++) {
                        if (patients[i].treatments[y].treatmentPerformed == false && patients[i].treatments[y].canceledTreatment == false) {
                            for (var z = 0; z < patients[i].treatments[y].length; z++) {
                                if (patients[i].treatments[y].sessions[z].everHeld == false && patients[i].treatments[y].sessions[z].canceledSession == false) {


                                    if ((patients[i].treatments[y].sessions[z].dateSchedulingStart >= dateStart && patients[i].treatments[y].sessions[z].dateSchedulingStart < dateEnd) ||
                                        (patients[i].treatments[y].sessions[z].dateSchedulingEnd > dateStart && patients[i].treatments[y].sessions[z].dateSchedulingEnd <= dateEnd)) {

                                        console.log('Error adding session: o professor selecionado já possui agenda para este horário');
                                        res.send('500', { status: 500, error: 'O professor selecionado já possui agenda para este horário' });
                                    }

                                }
                            }
                        }
                    }
                }

                return true;
            }
            else {

                return true;
            }
        }
        else {
            console.log(err);
            res.send('500', { status: 500, error: err });
        }


    });
}

var horarioDisponivelStudent = function (req, res) {

    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var session = req.body;
    var dateStart = new Date(session.dateSchedulingStart);
    var dateEnd = new Date(session.dateSchedulingEnd);
    for (i = 0; i <= 23; i++) {
        delete session[i];
    }

    patientRoute.PatientModel.find({ 'treatments.sessions.studentId': session.studentId, $or: [{ 'treatments.sessions.dateSchedulingStart': { '$gte': dateStart, '$lt': dateEnd } }, { 'treatments.sessions.dateSchedulingEnd': { '$gt': dateStart, '$lte': dateEnd } }] }, { _id: 1, 'treatments': 1 }, function (err, patients) {
        if (!err) {
            if (patients.length > 0) {

                for (var i = 0; i < patients.length; i++) {
                    for (var y = 0; y < patients[i].treatments.length; y++) {
                        if (patients[i].treatments[y].treatmentPerformed == false && patients[i].treatments[y].canceledTreatment == false) {
                            for (var z = 0; z < patients[i].treatments[y].length; z++) {
                                if (patients[i].treatments[y].sessions[z].everHeld == false && patients[i].treatments[y].sessions[z].canceledSession == false) {


                                    if ((patients[i].treatments[y].sessions[z].dateSchedulingStart >= dateStart && patients[i].treatments[y].sessions[z].dateSchedulingStart < dateEnd) ||
                                        (patients[i].treatments[y].sessions[z].dateSchedulingEnd > dateStart && patients[i].treatments[y].sessions[z].dateSchedulingEnd <= dateEnd)) {

                                        console.log('Error adding session: o aluno selecionado já possui agenda para este horário');
                                        res.send('500', { status: 500, error: 'O aluno selecionado já possui agenda para este horário' });
                                    }

                                }
                            }
                        }
                    }
                }

                return true;
            }
            else {

                return true;
            }
        }
        else {
            console.log(err);
            res.send('500', { status: 500, error: err });
        }


    });
}

var verificaHorario = function (req, res, callback) {
    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var session = req.body;
    var dateStart = new Date(session.dateSchedulingStart);
    var dateEnd = new Date(session.dateSchedulingEnd);

    for (i = 0; i <= 23; i++) {
        delete session[i];
    }

    if (typeof callback !== 'function') {
        callback = false;
    }


    if (horarioDisponivelPatient(req, res)) {

        if (horarioDisponivelTeacher(req, res)) {

            if (horarioDisponivelStudent(req, res)) {
                if (callback) {
                    callback(req, res);
                }
            }

        }
    }
}

var addSession = function (req, res) {
    var idPatient = req.params.idPatient;
    var idTreatment = req.params.idTreatment;
    var session = req.body;

    for (i = 0; i <= 23; i++) {
        delete session[i];
    }
    console.log('Adding session');
    session.dateInclusion = new Date();
    session.treatmentPerformed = false;
    session.canceledTreatment = false;


    if (validateSession(res, session)) {

        patientRoute.PatientModel.findOne({ '_id': idPatient, 'treatments._id': idTreatment }, { _id: 1, 'treatments': 1 }, function (err, patient) {
            if (!err) {
                if (patient) {

                    delete session._id;
                    session.idTreatment = idTreatment;

                    for (var i = 0; i < patient.treatments.length; i++) {
                        if (patient.treatments[i]._id == idTreatment) {
                            {
                                if (patient.treatments[i].canceledTreatment || patient.treatments[i].treatmentPerformed) {
                                    console.log('Error updating session: tratamento realizado ou cancelado');
                                    res.send('500', { status: 500, error: 'Tratamento realizado ou cancelado' });
                                }
                                else {




                                    patient.treatments[i].sessions.push(session);

                                    patient.save(function (err, result) {
                                        if (err) {
                                            console.log('Error updating session: ' + err);
                                            res.send('500', { status: 500, error: err });
                                        } else {
                                            console.log('document(s) updated');


                                            patientRoute.PatientModel.findOne({ '_id': idPatient, 'treatments._id': idTreatment }, { _id: 1, 'treatments': 1 }, function (err, patient) {
                                                if (!err) {
                                                    if (patient) {
                                                        for (var i = 0; i < patient.treatments.length; i++) {
                                                            if (patient.treatments[i]._id == idTreatment) {
                                                                res.send(patient.treatments[i].sessions[patient.treatments[i].sessions.length - 1]);
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    console.log('Error updating session: ' + err);
                                                    res.send('500', { status: 500, error: err });
                                                }
                                            });
                                        }
                                    });





                                }
                            }
                        }
                    }


                }
            }
            else {
                console.log(err);
                res.send('500', { status: 500, error: err });
            }

        });
    }
}

var uptSession = function (req, res) {
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
        console.log('Updating session');
        session.dateUpdate = new Date();
        var objectID = new ObjectID(id);

        if (validateSession(res, session)) {

            return patientRoute.PatientModel.findOne({ 'treatments.sessions._id': id }, function (err, patients) {
                if (!err) {

                    for (var j = 0; j < patients.treatments.length; j++) {


                        for (var i = 0; i < patients.treatments[j].sessions.length; i++) {
                            if (patients.treatments[j].sessions[i]._id == id) {

                                patients.treatments[j].sessions[i].studentName = session.studentName;
                                patients.treatments[j].sessions[i].teacherId = session.teacherId;
                                patients.treatments[j].sessions[i].teacherName = session.teacherName;
                                patients.treatments[j].sessions[i].typeSession = session.typeSession;
                                patients.treatments[j].sessions[i].typeService = session.typeService;
                                patients.treatments[j].sessions[i].dateSchedulingStart = session.dateSchedulingStart;
                                patients.treatments[j].sessions[i].dateSchedulingEnd = session.dateSchedulingEnd;
                                patients.treatments[j].sessions[i].everHeld = session.everHeld;
                                patients.treatments[j].sessions[i].canceledSession = session.canceledSession;
                                patients.treatments[j].sessions[i].observations = session.observations;
                                patients.treatments[j].sessions[i].dateUpdate = session.dateUpdate;

                                patients.save(function () { res.send(session); });
                            }
                        }

                    }




                } else {
                    console.log('Error updating session: ' + err);
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

        return patientRoute.PatientModel.findOne({ 'treatments.sessions._id': id }, { _id: 1, name: 1, 'treatments.': 1 }, function (err, patients) {
            if (!err) {
                if (patients) {

                    for (var i = 0; i < patients.treatments.length; i++) {
                        patients.treatments[i].sessions.remove(id);
                    }


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

        verificaHorario(req, res, uptSession);
    }
}

module.exports.getSessionsAll = getSessionsAll;
module.exports.getSessionsById = getSessionsById;
module.exports.getSessionsByType = getSessionsByType;
module.exports.postSession = postSession;
module.exports.delSession = delSession;
module.exports.putSession = putSession;