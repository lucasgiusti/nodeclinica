
//************************************************************
var express = require("express"),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    treatmentRoute = require("./treatment"),
    accountRoute = require("./account"),
    utilRoute = require("./util");
//************************************************************


var Schema = mongoose.Schema;

// Treatment Model
var Treatment = new Schema({
    serviceArea: { type: String, required: true },
    diagnosis: { type: String, required: false },
    status: { type: String, required: true },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: false },
    doctor: { type: String, required: false },
    CRMDoctor: { type: String, required: false },
    observations: { type: String, required: false },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: false },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: false },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    phone1: { type: String, required: false },
    dateBirth: { type: Date, required: true },
    sex: { type: String, required: true },
    phone2: { type: String, required: false },
    phone3: { type: String, required: false },
    cpf: { type: String, required: false },
    responsibleName: { type: String, required: false },
    responsibleCPF: { type: String, required: false },
    observations: { type: String, required: false },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false },
    treatments: [Treatment]
});

var PatientModel = mongoose.model('patients', Patient);

var validatePatient = function (res, patient) {

    if ((patient.name == null) || (patient.name != null && !iz.between(patient.name.length, 1, 100))) {
        console.log('Error adding patient: o nome deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((patient.address == null) || (patient.address != null && !iz.between(patient.address.length, 1, 100))) {
        console.log('Error adding patient: o endereco deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }

    if ((patient.number == null) || (patient.number != null && !iz.between(patient.number.length, 1, 10))) {
        console.log('Error adding patient: o numero deve ter 1 a 10 caracteres');
        res.send('500', { status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }

    if (!iz.maxLength(patient.complement, 20)) {
        console.log('Error adding patient: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.complement == null)) { delete patient.complement; }

    if (!iz.maxLength(patient.district, 50)) {
        console.log('Error adding patient: o bairro deve ter maximo 50 caracteres');
        res.send('500', { status: 500, error: 'O bairro deve ter maximo 50 caracteres' });
        return false;
    }
    if ((patient.district == null)) { delete patient.district; }

    if ((patient.state == null) && (patient.state != null && !iz.between(patient.state.length, 1, 50))) {
        console.log('Error adding patient: estado invalido');
        res.send('500', { status: 500, error: 'Estado invalido' });
        return false;
    }

    if ((patient.city == null) && (patient.city != null && !iz.between(patient.city.length, 1, 50))) {
        console.log('Error adding patient: cidade invalida');
        res.send('500', { status: 500, error: 'Cidade invalida' });
        return false;
    }

    if (!iz.maxLength(patient.cep, 9)) {
        console.log('Error adding patient: o cep deve ter maximo 9 caracteres');
        res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((patient.cep == null)) { delete patient.cep; }

    if ((patient.maritalStatus == null)) { delete patient.maritalStatus; }
    if ((patient.mail == null)) { delete patient.mail; }
    if ((patient.responsibleName == null)) { delete patient.responsibleName; }
    if ((patient.responsibleCPF == null)) { delete patient.responsibleCPF; }
    if ((patient.observations == null)) { delete patient.observations; }

    if (!iz.maxLength(patient.phone1, 20)) {
        console.log('Error adding patient: o telefone 1 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 1 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone1 == null)) { delete patient.phone1; }

    console.log(patient.dateBirth);
    if (!iz(patient.dateBirth).required().date().valid) {
        console.log('Error adding patient: data de nascimento invalida');
        res.send('500', { status: 500, error: 'Data de nascimento invalida' });
        return false;
    }

    if (patient.sex == null) {
        console.log('Error adding patient: sexo invalido');
        res.send('500', { status: 500, error: 'Sexo invalido' });
        return false;
    }

    if (!iz.maxLength(patient.phone2, 20)) {
        console.log('Error adding patient: o telefone 2 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone2 == null)) { delete patient.phone2; }

    if (!iz.maxLength(patient.phone3, 20)) {
        console.log('Error adding patient: o telefone 3 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone3 == null)) { delete patient.phone3; }

    if ((patient.cpf == null || !utilRoute.validaCpf(patient.cpf)) && (patient.responsibleCPF == null || !utilRoute.validaCpf(patient.responsibleCPF))) {
        console.log('Error adding patient: um CPF valido deve ser informado para o paciente ou o responsavel');
        res.send('500', { status: 500, error: 'Um CPF valido deve ser informado para o paciente ou o responsavel' });
        return false;
    }

    if (patient.responsibleCPF != null || patient.resposibleName != null) {
        console.log('Error adding patient: caso tenha um responsavel, devem ser informados nome e CPF do mesmo');
        res.send('500', { status: 500, error: 'Caso tenha um responsavel, devem ser informados nome e CPF do mesmo' });
        return false;
    }

    if (!iz(patient.dateInclusion).required().date().valid) {
        console.log('Error adding patient: data de inclusao invalida');
        res.send('500', { status: 500, error: 'Data de inclusao invalida' });
        return false;
    }

    return true;

}

var putPatient = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var patient = req.body;
        delete patient._id;

        console.log('Updating patient');
        patient.dateUpdate = new Date();
        var objectID = new ObjectID(id);

        PatientModel = mongoose.model('patients', Patient);


        if (validatePatient(res, patient)) {

            if (patient.cpf) {

                PatientModel.findOne({ 'cpf': patient.cpf, '_id': { $nin: [objectID]} }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error updating patient: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                        }
                        else {
                            //UPDATE PATIENT
                            PatientModel.update({ '_id': id }, patient, { safe: true }, function (err, result) {
                                if (err) {
                                    console.log('Error updating patient: ' + err);
                                    res.send('500', { status: 500, error: err });
                                } else {
                                    console.log('' + result + ' document(s) updated');

                                    res.send(patient);
                                }
                            });
                        }
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
            else {
                //UPDATE PATIENT
                PatientModel.update({ '_id': id }, patient, { safe: true }, function (err, result) {
                    if (err) {
                        console.log('Error updating patient: ' + err);
                        res.send('500', { status: 500, error: err });
                    } else {
                        console.log('' + result + ' document(s) updated');

                        res.send(patient);
                    }
                });
            }
        }
    }
}

var postPatient = function (req, res) {
    
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var patient = req.body;
        console.log('Adding patient');
        patient.dateInclusion = new Date();

        if (validatePatient(res, patient)) {

            PatientModel = mongoose.model('patients', Patient);
            if (patient.cpf) {
                PatientModel.findOne({ 'cpf': patient.cpf }, function (err, u) {
                    if (!err) {
                        if (u) {
                            console.log('Error adding patient: o CPF ja existe');
                            res.send('500', { status: 500, error: 'O CPF ja existe' });
                            return;
                        }
                        else {
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
                    } else {
                        console.log(err);
                        res.send('500', { status: 500, error: err });
                    }
                });
            }
            else {
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
}

var delPatient = function (req, res) {
    if (!accountRoute.isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        console.log('Deleting patient: ' + req.params.id);

        PatientModel = mongoose.model('patients', Patient);
        PatientModel.findOne({ '_id': req.params.id }, { _id: 1 }, function (err, patient) {
            if (!err) {
                if (patient) {
                    patient.remove(function () { res.send(patient); });
                }
            }
            else {
                res.send('500', { status: 500, error: 'Usuario nao encontrado' });
            }
        });
    }
}

var getPatientsAll = function (req, res) {
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByName = function (req, res) {
    var name = req.params.name;
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i'} }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    return PatientModel.find({ 'cpf': { '$regex': cpf} }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsById = function (req, res) {
    var id = req.params.id;
    return PatientModel.findById(id, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

module.exports.PatientModel = PatientModel;
module.exports.getPatientsAll = getPatientsAll;
module.exports.getPatientsByName = getPatientsByName;
module.exports.getPatientsByCpf = getPatientsByCpf;
module.exports.getPatientsById = getPatientsById;
module.exports.putPatient = putPatient;
module.exports.delPatient = delPatient;
module.exports.postPatient = postPatient;