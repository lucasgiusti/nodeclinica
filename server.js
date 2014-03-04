
//************************************************************
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    http = require('http'),
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
    patientRoute = require("./routes/patient")
    treatmentRoute = require("./routes/treatment");


// Config
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
        app.use(express.bodyParser());
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
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
    });
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
app.put('/students/:id', auth, studentRoute.putStudent);
app.del('/students/:id', auth, studentRoute.delStudent);
app.post('/students', auth, studentRoute.postStudent);

// TEACHERS
app.get('/teachers', auth, teacherRoute.getTeachersAll);
app.get('/teachers/name/:name', auth, teacherRoute.getTeachersByName);
app.get('/teachers/cpf/:cpf', auth, teacherRoute.getTeachersByCpf);
app.get('/teachers/registration/:registration', auth, teacherRoute.getTeachersByRegistration);
app.get('/teachers/:id', auth, teacherRoute.getTeachersById);
app.put('/teachers/:id', auth, teacherRoute.putTeacher);
app.del('/teachers/:id', auth, teacherRoute.delTeacher);
app.post('/teachers', auth, teacherRoute.postTeacher);

// ATTENDANTS
app.get('/attendants', auth, attendantRoute.getAttendantsAll);
app.get('/attendants/name/:name', auth, attendantRoute.getAttendantsByName);
app.get('/attendants/cpf/:cpf', auth, attendantRoute.getAttendantsByCpf);
app.get('/attendants/registration/:registration', auth, attendantRoute.getAttendantsByRegistration);
app.get('/attendants/:id', auth, attendantRoute.getAttendantsById);
app.put('/attendants/:id', auth, attendantRoute.putAttendant);
app.del('/attendants/:id', auth, attendantRoute.delAttendant);
app.post('/attendants', auth, attendantRoute.postAttendant);

// MANAGERS
app.get('/managers', auth, managerRoute.getManagersAll);
app.get('/managers/name/:name', auth, managerRoute.getManagersByName);
app.get('/managers/cpf/:cpf', auth, managerRoute.getManagersByCpf);
app.get('/managers/registration/:registration', auth, managerRoute.getManagersByRegistration);
app.get('/managers/:id', auth, managerRoute.getManagersById);
app.put('/managers/:id', auth, managerRoute.putManager);
app.del('/managers/:id', auth, managerRoute.delManager);
app.post('/managers', auth, managerRoute.postManager);

// PATIENTS
app.get('/patients', auth, patientRoute.getPatientsAll);
app.get('/patients/name/:name', auth, patientRoute.getPatientsByName);
app.get('/patients/cpf/:cpf', auth, patientRoute.getPatientsByCpf);
app.get('/patients/:id', auth, patientRoute.getPatientsById);
app.put('/patients/:id', auth, patientRoute.putPatient);
app.del('/patients/:id', auth, patientRoute.delPatient);
app.post('/patients', auth, patientRoute.postPatient);

// TREATMENTS
app.get('/patients/:idPatient/treatments', auth, treatmentRoute.getTreatmentsAll);
app.get('/patients/:idPatient/treatments/:id', auth, treatmentRoute.getTreatmentsById);
app.post('/patients/:idPatient/treatments', auth, treatmentRoute.postTreatment);
app.del('/patients/:idPatient/treatments/:id', auth, treatmentRoute.delTreatment);
app.put('/patients/:idPatient/treatments/:id', auth, treatmentRoute.putTreatment);
//************************************************************


// Launch server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Node Application server listening on port " + app.get('port'));
});