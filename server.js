﻿//************************************************************

var application_root = __dirname,
    express = require("express"),
    session = require("express-session"),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require("path"),
    http = require('http'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    app = express(),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    iz = require('iz'),
    ObjectID = require('mongodb').ObjectID,
    passportLocalMongoose = require('passport-local-mongoose'),

    accountRoute = require("./routes/account"),
    userRoute = require("./routes/user"),
    studentRoute = require("./routes/student"),
    teacherRoute = require("./routes/teacher"),
    attendantRoute = require("./routes/attendant"),
    managerRoute = require("./routes/manager"),
    patientRoute = require("./routes/patient"),
    treatmentRoute = require("./routes/treatment"),
    sessionRoute = require("./routes/session"),
    painelRoute = require("./routes/painel"),
    utilRoute = require("./routes/util");


// Config
        app.set('port', process.env.PORT || 3000);
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(session({ secret: 'nodeclinicakey', resave: true, saveUninitialized: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(cookieParser());
        app.use(function (req, res, next) {
            if (req.method == 'POST' && req.url == '/login') {

                if (req.body.rememberme) {
                    var hour = 3600000;
                    req.session.cookie.maxAge = 7 * 24 * hour; //1 week
                } else {
                    req.session.cookie.expires = false;
                }
            }
            next();
        });
        app.use(passport.initialize());
        app.use(passport.session());
//************************************************************



var AccountModel = accountRoute.AccountModel;
var UserModel = userRoute.UserModel;
var PatientModel = patientRoute.PatientModel;
var auth = accountRoute.auth;
var isAuthorized = accountRoute.isAuthorized;




//************************************************************
var connectionString = require('./models/conn');
mongoose.connect(connectionString);

accountRoute.CreateAdmUser();




//************************************************************
// ACCOUNT
app.get('/account/:username', auth, accountRoute.findByUserName);
app.put('/account/:id', auth, accountRoute.putAccount);
app.get('/loggedtest', accountRoute.loggedtest);
app.post('/login', accountRoute.login);
app.get('/logout', accountRoute.logout);

// STUDENTS
app.get('/students', auth, studentRoute.getStudentsAll);
app.get('/students/name/:name', auth, studentRoute.getStudentsByName);
app.get('/students/cpf/:cpf', auth, studentRoute.getStudentsByCpf);
app.get('/students/registration/:registration', auth, studentRoute.getStudentsByRegistration);
app.get('/students/:id', auth, studentRoute.getStudentsById);
app.get('/studentsactive', auth, studentRoute.getStudentsActive);
app.put('/students/:id', auth, studentRoute.putStudent);
app.delete('/students/:id', auth, studentRoute.delStudent);
app.post('/students', auth, studentRoute.postStudent);

// TEACHERS
app.get('/teachers', auth, teacherRoute.getTeachersAll);
app.get('/teachers/name/:name', auth, teacherRoute.getTeachersByName);
app.get('/teachers/cpf/:cpf', auth, teacherRoute.getTeachersByCpf);
app.get('/teachers/registration/:registration', auth, teacherRoute.getTeachersByRegistration);
app.get('/teachers/:id', auth, teacherRoute.getTeachersById);
app.get('/teachersactive', auth, teacherRoute.getTeachersActive);
app.put('/teachers/:id', auth, teacherRoute.putTeacher);
app.delete('/teachers/:id', auth, teacherRoute.delTeacher);
app.post('/teachers', auth, teacherRoute.postTeacher);

// ATTENDANTS
app.get('/attendants', auth, attendantRoute.getAttendantsAll);
app.get('/attendants/name/:name', auth, attendantRoute.getAttendantsByName);
app.get('/attendants/cpf/:cpf', auth, attendantRoute.getAttendantsByCpf);
app.get('/attendants/registration/:registration', auth, attendantRoute.getAttendantsByRegistration);
app.get('/attendants/:id', auth, attendantRoute.getAttendantsById);
app.put('/attendants/:id', auth, attendantRoute.putAttendant);
app.delete('/attendants/:id', auth, attendantRoute.delAttendant);
app.post('/attendants', auth, attendantRoute.postAttendant);

// MANAGERS
app.get('/managers', auth, managerRoute.getManagersAll);
app.get('/managers/name/:name', auth, managerRoute.getManagersByName);
app.get('/managers/cpf/:cpf', auth, managerRoute.getManagersByCpf);
app.get('/managers/registration/:registration', auth, managerRoute.getManagersByRegistration);
app.get('/managers/:id', auth, managerRoute.getManagersById);
app.put('/managers/:id', auth, managerRoute.putManager);
app.delete('/managers/:id', auth, managerRoute.delManager);
app.post('/managers', auth, managerRoute.postManager);

// PATIENTS
app.get('/patients', auth, patientRoute.getPatientsAll);
app.get('/patients/name/:name', auth, patientRoute.getPatientsByName);
app.get('/patients/cpf/:cpf', auth, patientRoute.getPatientsByCpf);
app.get('/patients/:id', auth, patientRoute.getPatientsById);
app.get('/patients/painel/:type', auth, patientRoute.getPatientsByPainel);
app.put('/patients/:id', auth, patientRoute.putPatient);
app.delete('/patients/:id', auth, patientRoute.delPatient);
app.post('/patients', auth, patientRoute.postPatient);

// TREATMENTS
app.get('/patients/:idPatient/treatments', auth, treatmentRoute.getTreatmentsAll);
app.get('/patients/:idPatient/treatments/:id', auth, treatmentRoute.getTreatmentsById);
app.post('/patients/:idPatient/treatments', auth, treatmentRoute.postTreatment);
app.delete('/patients/:idPatient/treatments/:id', auth, treatmentRoute.delTreatment);
app.put('/patients/:idPatient/treatments/:id', auth, treatmentRoute.putTreatment);
//************************************************************

// SESSIONS
app.get('/patients/:idPatient/treatments/:idTreatment/sessions', auth, sessionRoute.getSessionsAll);
app.get('/patients/:idPatient/treatments/:idTreatment/sessions/:id', auth, sessionRoute.getSessionsById);
app.get('/sessions/:id/type/:type', auth, sessionRoute.getSessionsByType);
app.post('/patients/:idPatient/treatments/:idTreatment/sessions', auth, sessionRoute.postSession);
app.delete('/patients/:idPatient/treatments/:idTreatment/sessions/:id', auth, sessionRoute.delSession);
app.put('/patients/:idPatient/treatments/:idTreatment/sessions/:id', auth, sessionRoute.putSession);

// PAINEL
app.get('/painel', auth, painelRoute.getPainelAll);

// DOWNLOADS
app.get('/downloads/manualUsuario', auth, utilRoute.downloadManualUsuario);


// RELATORIOS
app.get('/relpatients', auth, patientRoute.getRelPatientsAll);
app.get('/relcompletepatients', auth, patientRoute.getRelCompletePatientsAll);
app.get('/xmlcompletepatients', patientRoute.getXmlCompletePatientsAll);
app.get('/relusers', auth, userRoute.getRelUsersAll);
app.get('/xmlcompleteusers', auth, userRoute.getXmlCompleteUsersAll);


// Launch server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Node Clinica Application server listening on port " + app.get('port'));
});