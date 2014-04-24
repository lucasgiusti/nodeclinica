﻿
//************************************************************
var
    path = require("path"),
    mime = require('mime'),
    http = require('http'),
    express = require("express"),
    fs = require('fs'),
    mongoose = require('mongoose'),
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    accountRoute = require("./account"),
    utilRoute = require("./util"),
    jstoxml = require('./jstoxml');
//************************************************************


var Schema = mongoose.Schema;

// Session Model
var Session = new Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    teacherId: { type: String, required: true },
    teacherName: { type: String, required: true },
    typeSession: { type: String, required: true },
    typeService: { type: String, required: true },
    dateSchedulingStart: { type: Date, required: true },
    dateSchedulingEnd: { type: Date, required: true },
    everHeld: { type: Boolean, required: true },
    canceledSession: { type: Boolean, required: true },
    observations: { type: String, required: false },
    idTreatment: { type: String, required: true },
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false }
});

// Treatment Model
var Treatment = new Schema({
    serviceArea: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatmentPerformed: { type: Boolean, required: true },
    canceledTreatment: { type: Boolean, required: true },
    doctor: { type: String, required: true },
    CRMDoctor: { type: String, required: true },
    observations: { type: String, required: false },
    idPatient: {type: String, required: true},
    dateInclusion: { type: Date, required: true },
    dateUpdate: { type: Date, required: false },
    sessions: [Session]
});

// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: false },
    address: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String, required: false },
    district: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    cep: { type: String, required: false },
    maritalStatus: { type: String, required: true },
    phone1: { type: String, required: true },
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

    if ((patient.name == null) || (patient.name != null && !iz.between(patient.name.trim().length, 1, 100))) {
        console.log('Error adding patient: o nome deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O nome deve ter 1 a 100 caracteres' });
        return false;
    }
    patient.name = patient.name.trim();

    if ((patient.address == null) || (patient.address != null && !iz.between(patient.address.trim().length, 1, 100))) {
        console.log('Error adding patient: o endereco deve ter 1 a 100 caracteres');
        res.send('500', { status: 500, error: 'O endereco deve ter 1 a 100 caracteres' });
        return false;
    }
    patient.address = patient.address.trim();

    if ((patient.number == null) || (patient.number != null && !iz.between(patient.number.trim().length, 1, 10))) {
        console.log('Error adding patient: o numero deve ter 1 a 10 caracteres');
        res.send('500', { status: 500, error: 'O numero deve ter 1 a 10 caracteres' });
        return false;
    }
    patient.number = patient.number.trim();

    if (!iz.maxLength(patient.complement, 20)) {
        console.log('Error adding patient: o complemento deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O complemento deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.complement == null)) { delete patient.complement; } else { patient.complement = patient.complement.trim();}

    if ((patient.district == null) || (patient.district != null && !iz.between(patient.district.trim().length, 1, 50))) {
        console.log('Error adding patient: o bairro deve ter 1 a 50 caracteres');
        res.send('500', { status: 500, error: 'O bairro deve ter 1 a 50 caracteres' });
        return false;
    }
    patient.district = patient.district.trim();
    
    if ((patient.state == null) || (patient.state != null && !iz.between(patient.state.trim().length, 1, 50))) {
        console.log('Error adding patient: estado invalido');
        res.send('500', { status: 500, error: 'Estado invalido' });
        return false;
    }
    patient.state = patient.state.trim();

    if ((patient.city == null) || (patient.city != null && !iz.between(patient.city.trim().length, 1, 50))) {
        console.log('Error adding patient: cidade invalida');
        res.send('500', { status: 500, error: 'Cidade invalida' });
        return false;
    }
    patient.city = patient.city.trim();

    if (!iz.maxLength(patient.cep, 9)) {
        console.log('Error adding patient: o cep deve ter maximo 9 caracteres');
        res.send('500', { status: 500, error: 'O cep deve ter maximo 9 caracteres' });
        return false;
    }
    if ((patient.cep == null)) { delete patient.cep; } else { patient.cep = patient.cep.trim();}

    if (patient.maritalStatus == null || patient.maritalStatus == '') {
        console.log('Error adding patient: estado civil invalido');
        res.send('500', { status: 500, error: 'Estado civil invalido' });
        return false;
    }
    patient.maritalStatus = patient.maritalStatus.trim();
    
    if ((patient.mail == null)) { delete patient.mail; } else { patient.mail = patient.mail.trim();}
    if ((patient.observations == null)) { delete patient.observations; } else { patient.observations = patient.observations.trim();}

    if ((patient.phone1 == null) || (patient.phone1 != null && !iz.between(patient.phone1.trim().length, 1, 20))) {
        console.log('Error adding user: o telefone 1 deve ter 1 a 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 1 deve ter 1 a 20 caracteres' });
        return false;
    }
    patient.phone1 = patient.phone1.trim();

    if (!iz(patient.dateBirth).required().date().valid) {
        console.log('Error adding patient: data de nascimento invalida');
        res.send('500', { status: 500, error: 'Data de nascimento invalida' });
        return false;
    }

    patient.dateBirth = new Date(patient.dateBirth);

    if (patient.dateBirth > new Date()) {
        console.log('Error adding patient: data de nascimento invalida');
        res.send('500', { status: 500, error: 'Data de nascimento invalida' });
        return false;
    }

    if (patient.sex == null) {
        console.log('Error adding patient: sexo invalido');
        res.send('500', { status: 500, error: 'Sexo invalido' });
        return false;
    }
    patient.sex = patient.sex.trim();

    if (!iz.maxLength(patient.phone2, 20)) {
        console.log('Error adding patient: o telefone 2 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 2 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone2 == null)) { delete patient.phone2; } else { patient.phone2 = patient.phone2.trim();}

    if (!iz.maxLength(patient.phone3, 20)) {
        console.log('Error adding patient: o telefone 3 deve ter maximo 20 caracteres');
        res.send('500', { status: 500, error: 'O telefone 3 deve ter maximo 20 caracteres' });
        return false;
    }
    if ((patient.phone3 == null)) { delete patient.phone3; } else { patient.phone3 = patient.phone3.trim();}

    if ((patient.cpf == null || !utilRoute.validaCpf(patient.cpf)) && (patient.responsibleCPF == null || !utilRoute.validaCpf(patient.responsibleCPF))) {
        console.log('Error adding patient: um CPF valido deve ser informado para o paciente ou o responsavel');
        res.send('500', { status: 500, error: 'Um CPF valido deve ser informado para o paciente ou o responsavel' });
        return false;
    }
    if ((patient.cpf != null)) { patient.cpf = patient.cpf.trim(); }
    if ((patient.responsibleCPF == !null)) { patient.responsibleCPF = patient.responsibleCPF.trim(); }


    if (patient.responsibleName != null && !iz.maxLength(patient.responsibleName.trim(), 100)) {
        console.log('Error adding patient: o nome do responsavel deve ter maximo 100 caracteres');
        res.send('500', { status: 500, error: 'O nome do responsavel deve ter maximo 100 caracteres' });
        return false;
    }
    if ((patient.responsibleName == !null)) { patient.responsibleName = patient.responsibleName.trim(); }


    if (((patient.responsibleCPF != null && patient.responsibleCPF != '') && (patient.responsibleName == null || (patient.responsibleName != null && patient.responsibleName.trim() == '')))
        || ((patient.responsibleName != null && patient.responsibleName != '') && (patient.responsibleCPF == null || (patient.responsibleCPF != null && patient.responsibleCPF.trim() == '')))) {
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
                            delete patient.treatments;
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
                delete patient.treatments;
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
        PatientModel.findOne({ '_id': req.params.id }, function (err, patient) {
            if (!err) {
                if (patient) {
                    if (patient.treatments.length > 0) {
                        res.send('500', { status: 500, error: 'Existe tratamento para este paciente' });
                    }
                    else {
                        patient.remove(function () { res.send(patient); });
                    }
                }
            }
            else {
                res.send('500', { status: 500, error: 'Usuario nao encontrado' });
            }
        });
    }
}

var getPatientsAll = function (req, res) {
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getRelPatientsAll = function (req, res) {
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({}, {name: 1, dateBirth: 1, cpf: 1, sex: 1, phone1: 1, address: 1, number: 1, cep: 1, complement: 1, city: 1, state: 1, dateInclusion: 1}).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getRelCompletePatientsAll = function (req, res) {
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({}).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getXmlCompletePatientsAll = function (req, res) {
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({}).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

            xml += '<patients>';
            for (var i = 0; i < patients.length; i++) {

                var str = JSON.stringify(patients[i]);

                while (str.indexOf('"observations":null,') != -1) {
                    str = str.replace('"observations":null,', '');
                }
                while (str.indexOf('"dateUpdate":null,') != -1) {
                    str = str.replace('"dateUpdate":null,', '');
                }
                while (str.indexOf('"mail":null,') != -1) {
                    str = str.replace('"mail":null,', '');
                }
                while (str.indexOf('"complement":null,') != -1) {
                    str = str.replace('"complement":null,', '');
                }
                while (str.indexOf('"cep":null,') != -1) {
                    str = str.replace('"cep":null,', '');
                }
                while (str.indexOf('"phone2":null,') != -1) {
                    str = str.replace('"phone2":null,', '');
                }
                while (str.indexOf('"phone3":null,') != -1) {
                    str = str.replace('"phone3":null,', '');
                }
                while (str.indexOf('"cpf":null,') != -1) {
                    str = str.replace('"cpf":null,', '');
                }
                while (str.indexOf('"responsibleName":null,') != -1) {
                    str = str.replace('"responsibleName":null,', '');
                }
                while (str.indexOf('"responsibleCPF":null,') != -1) {
                    str = str.replace('"responsibleCPF":null,', '');
                }

                var obj = JSON.parse(str);

                xml += '<patient>';
                xml += jstoxml.toXML(obj);
                xml += '</patient>';
            }
            xml += '</patients>';

            



            var codigo = new ObjectID();
            var file = __dirname.replace('routes', '') + 'public/downloads/exportPatients-' + codigo + '.xml';

            fs.writeFile(file, xml, function (err, data) {

                if (err) {
                    return console.log(err);
                }
                else {
                    var filename = path.basename(file);
                    var mimetype = mime.lookup(file);



                    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                    res.setHeader('Content-type', mimetype);

                    var filestream = fs.createReadStream(file);
                    filestream.pipe(res);
                }
            });


        } else {
            return console.log(err);
        }
    });
};

var getPatientsByName = function (req, res) {
    var name = req.params.name;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i' } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByCpf = function (req, res) {
    var cpf = req.params.cpf;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.find({ 'cpf': { '$regex': cpf } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }).sort({ name: 1 }).exec(function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsById = function (req, res) {
    var id = req.params.id;
    PatientModel = mongoose.model('patients', Patient);
    return PatientModel.findById(id, {
        name: 1,
        mail: 1,
        address: 1,
        number: 1,
        complement: 1,
        district: 1,
        state: 1,
        city: 1,
        cep: 1,
        maritalStatus: 1,
        phone1: 1,
        dateBirth: 1,
        sex: 1,
        phone2: 1,
        phone3: 1,
        cpf: 1,
        responsibleName: 1,
        responsibleCPF: 1,
        observations: 1,
        dateInclusion: 1,
        dateUpdate: 1,
    }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
};

var getPatientsByPainel = function (req, res) {
    var type = req.params.type;
    var serviceArea = '';

    if (type == 'pENA' || type == 'pTNA' || type == 'pANA') { serviceArea = 'NEURO ADULTO'; }
    if (type == 'pENP' || type == 'pTNP' || type == 'pANP') { serviceArea = 'NEURO PEDIATRIA'; }
    if (type == 'pEOT' || type == 'pTOT' || type == 'pAOT') { serviceArea = 'ORTOPEDIA TRAUMATOLOGIA'; }
    if (type == 'pEUM' || type == 'pTUM' || type == 'pAUM') { serviceArea = 'UROGENICOLOGIA MASTOLOGIA'; }
    if (type == 'pEH' || type == 'pTH' || type == 'pAH') { serviceArea = 'HIDROTERAPIA'; }
    if (type == 'pESC' || type == 'pTSC' || type == 'pASC') { serviceArea = 'SAUDE COLETIVA'; }

    PatientModel = mongoose.model('patients', Patient);


    if (type.substring(0, 2) == 'pE') {
        return PatientModel.find({ 'treatments.sessions': { $size: 0 }, 'treatments.serviceArea': serviceArea }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
            if (!err) {
                return res.send(patients);
            } else {
                return console.log(err);
            }

        });
    }
    else {

        return PatientModel.find({ 'treatments.serviceArea': serviceArea }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
            if (!err) {


                var arrIds = new Array();

                //PT
                for (var i = 0; i < patients.length; i++) {
                    if (patients[i].treatments != null) {
                        for (var y = 0; y < patients[i].treatments.length; y++) {
                            if (patients[i].treatments[y].serviceArea == serviceArea && !patients[i].treatments[y].treatmentPerformed && !patients[i].treatments[y].canceledTreatment) {
                                if (patients[i].treatments[y].sessions.length > 0) {
                                    for (var z = 0; z < patients[i].treatments[y].sessions.length; z++) {
                                        if (!patients[i].treatments[y].sessions[z].canceledSession) {
                                            if (type.substring(0, 2) == 'pT' && patients[i].treatments[y].sessions[z].typeSession == "TRIAGEM" && patients[i].treatments[y].sessions[z].everHeld && !patients[i].treatments[y].sessions[z].canceledSession) {
                                                arrIds.push(new ObjectID(patients[i]._id.toString()));
                                                }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }


                //PA
                for (var i = 0; i < patients.length; i++) {
                    if (patients[i].treatments != null) {
                        for (var y = 0; y < patients[i].treatments.length; y++) {
                            if (patients[i].treatments[y].serviceArea == serviceArea && !patients[i].treatments[y].treatmentPerformed && !patients[i].treatments[y].canceledTreatment) {
                                if (patients[i].treatments[y].sessions.length > 0) {
                                    for (var z = 0; z < patients[i].treatments[y].sessions.length; z++) {
                                        if (!patients[i].treatments[y].sessions[z].canceledSession) {
                                            if (
                                                (!patients[i].treatments[y].sessions[z].everHeld && !patients[i].treatments[y].sessions[z].canceledSession)
                                                ||
                                                (!patients[i].treatments[y].sessions[z].everHeld && !patients[i].treatments[y].sessions[z].canceledSession)
                                                ) {
                                                arrIds = remove_item(arrIds, patients[i]._id.toString());

                                                if (type.substring(0, 2) == 'pA') {
                                                    arrIds.push(new ObjectID(patients[i]._id.toString()));
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                //incluindo novo objectId para ter pelo menos um
                //o correto é nao pesquisar e retornar vazio
                arrIds.push(new ObjectID());

                return PatientModel.find({ '_id': { '$in': arrIds } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1, treatments: 1 }).sort({ name: 1 }).exec(function (err, patients) {
                    if (!err) {

                        return res.send(patients);

                    } else {
                        return console.log(err);
                    };
                });

            } else {
                return console.log(err);
            }

        });
    }

}

remove_item = function (arr, value) {
    for (b in arr) {
        if (arr[b] == value) {
            arr.splice(b, 1);
            break;
        }
    }
    return arr;
}

module.exports.PatientModel = PatientModel;
module.exports.getPatientsAll = getPatientsAll;
module.exports.getPatientsByName = getPatientsByName;
module.exports.getPatientsByCpf = getPatientsByCpf;
module.exports.getPatientsById = getPatientsById;
module.exports.getPatientsByPainel = getPatientsByPainel;
module.exports.getRelPatientsAll = getRelPatientsAll;
module.exports.getRelCompletePatientsAll = getRelCompletePatientsAll;
module.exports.getXmlCompletePatientsAll = getXmlCompletePatientsAll;
module.exports.putPatient = putPatient;
module.exports.delPatient = delPatient;
module.exports.postPatient = postPatient;
module.exports.Treatment = Treatment;
module.exports.Patient = Patient;