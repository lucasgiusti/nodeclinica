
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
    attendantRoute = require("./routes/attendant");


//************************************************************


var AccountModel = accountRoute.AccountModel;
var UserModel = userRoute.UserModel;
var auth = accountRoute.auth;
var isAuthorized = accountRoute.isAuthorized;

//*****************************************
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




//************************************************************
var connectionString = require('./models/conn');
mongoose.connect(connectionString);
//************************************************************

AccountModel.find({ 'username': 'admin' }, { _id: 1 }, function (err, acc) {
    if (!err) {
        if (acc == '') {

            AccountModel.register(new AccountModel({ username: 'admin', dateInclusion: new Date(), type: 'ADMIN' }), 'admin', function (err, account) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Admin user created");
                }
            });

        }
    } else {
        console.log(err);
    }
});



//************************************************************
var Schema = mongoose.Schema;


// Patient Model
var Patient = new Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true }
});



var PatientModel = mongoose.model('patients', Patient);
//************************************************************





//************************************************************
// ACCOUNT

app.get('/account/:username', auth, accountRoute.findByUserName);
app.put('/account/:id', auth, accountRoute.putAccount);
app.get('/loggedtest', accountRoute.loggedtest);
app.post('/login', accountRoute.login);
app.get('/logout', accountRoute.logout);


//************************************************************
// STUDENTS

app.get('/students', auth, studentRoute.getStudentsAll);
app.get('/students/name/:name', auth, studentRoute.getStudentsByName);
app.get('/students/cpf/:cpf', auth, studentRoute.getStudentsByCpf);
app.get('/students/registration/:registration', auth, studentRoute.getStudentsByRegistration);
app.get('/students/:id', auth, studentRoute.getStudentsById);
app.put('/students/:id', auth, studentRoute.putStudent);
app.del('/students/:id', auth, studentRoute.delStudent);
app.post('/students', auth, studentRoute.postStudent);
//************************************************************




//************************************************************
// TEACHERS

app.get('/teachers', auth, teacherRoute.getTeachersAll);
app.get('/teachers/name/:name', auth, teacherRoute.getTeachersByName);
app.get('/teachers/cpf/:cpf', auth, teacherRoute.getTeachersByCpf);
app.get('/teachers/registration/:registration', auth, teacherRoute.getTeachersByRegistration);
app.get('/teachers/:id', auth, teacherRoute.getTeachersById);
app.put('/teachers/:id', auth, teacherRoute.putTeacher);
app.del('/teachers/:id', auth, teacherRoute.delTeacher);
app.post('/teachers', auth, teacherRoute.postTeacher);
//************************************************************




//************************************************************
// ATTENDANTS

app.get('/attendants', auth, attendantRoute.getAttendantsAll);
app.get('/attendants/name/:name', auth, attendantRoute.getAttendantsByName);
app.get('/attendants/cpf/:cpf', auth, attendantRoute.getAttendantsByCpf);
app.get('/attendants/registration/:registration', auth, attendantRoute.getAttendantsByRegistration);
app.get('/attendants/:id', auth, attendantRoute.getAttendantsById);
app.put('/attendants/:id', auth, attendantRoute.putAttendant);
app.del('/attendants/:id', auth, attendantRoute.delAttendant);
app.post('/attendants', auth, attendantRoute.postAttendant);
//************************************************************



//************************************************************
// GET to READ MANAGERS

// List managers
app.get('/managers', auth, function (req, res) {
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'type': type }, { _id: 1, name: 1, mail: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List managers by Name
app.get('/managers/name/:name', auth, function (req, res) {
    var name = req.params.name;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'name': { '$regex': name, $options: 'i' }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// List managers by CPF
app.get('/managers/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'cpf': { '$regex': cpf }, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});


// List managers by Registration
app.get('/managers/registration/:registration', auth, function (req, res) {
    var registration = req.params.registration;
    var type = 'GESTOR';
    UserModel = mongoose.model('users', User);
    return UserModel.find({ 'registration': registration, 'type': type }, { _id: 1, name: 1, registration: 1, cpf: 1, dateInclusion: 1, active: 1 }, function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            return console.log(err);
        }
    });
});

// Student by id
app.get('/managers/:id', auth, function (req, res) {
    var id = req.params.id;
    UserModel = mongoose.model('users', User);
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
});

app.put('/managers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        var user = req.body;
        delete user._id;
        console.log('Updating user: ' + id);
        user.dateUpdate = new Date();

        if (validateUser(res, user)) {
            putUser(res, user, id);
        }
    }
});

app.del('/managers/:id', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var id = req.params.id;
        console.log('Deleting user: ' + id);
        delUser(res, req, id);
    }
});

app.post('/managers', auth, function (req, res) {
    if (!isAuthorized(req.user.type, 'MANUTENCAO_CADASTRO')) {
        res.send('401', { status: 401, error: 'Acesso Negado' });
    }
    else {
        var user = req.body;
        console.log('Adding user');
        user.dateInclusion = new Date();

        if (validateUser(res, user)) {
            postUser(res, user);
        }
    }
});
//************************************************************




//************************************************************
// GET to READ PATIENTS


// List patients
app.get('/patients', auth, function (req, res) {
    return PatientModel.find({}, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// List patients by Name
app.get('/patients/name/:name', auth, function (req, res) {
    var name = req.params.name;
    return PatientModel.find({ 'name': { '$regex': name, $options: 'i' } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// List patients by CPF
app.get('/patients/cpf/:cpf', auth, function (req, res) {
    var cpf = req.params.cpf;
    return PatientModel.find({ 'cpf': { '$regex': cpf } }, { _id: 1, name: 1, dateBirth: 1, cpf: 1, sex: 1, dateInclusion: 1 }, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});

// Patient by id
app.get('/patients/:id', auth, function (req, res) {
    var id = req.params.id;


    return PatientModel.findById(id, function (err, patients) {
        if (!err) {
            return res.send(patients);
        } else {
            return console.log(err);
        }
    });
});
//************************************************************


//************************************************************
// Launch server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Node Application server listening on port " + app.get('port'));
});
//************************************************************







/*








var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    http = require('http'),
    mongoose = require('mongoose');
    base = require('./routes/base');

var app = express();

// Database


// Config
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev')); 
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/students', base.findStudentsAll);
app.get('/students/name/:name', base.findStudentsByName);
app.get('/students/:id', base.findStudentById);
app.post('/students', base.addStudent);
app.put('/students/:id', base.updateStudent);
app.delete('/students/:id', base.deleteStudent);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


*/