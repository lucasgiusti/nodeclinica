function signin() {
    window.location.assign("signin.html");
}

var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "wines": "wineList",
        "wines/page/:page": "wineList",
        "wines/add": "addWine",
        "wines/:id": "wineDetails",
        "students": "studentList",
        "students/page/:page": "studentList",
        "students/name/:name": "studentListByName",
        "students/name/:name/page/:page": "studentListByName",
        "students/cpf/:cpf": "studentListByCPF",
        "students/cpf/:cpf/page/:page": "studentListByCPF",
        "students/registration/:registration": "studentListByRegistration",
        "students/registration/:registration/page/:page": "studentListByRegistration",
        "students/add": "addStudent",
        "students/:id": "studentDetails",
        "teachers": "teacherList",
        "teachers/page/:page": "teacherList",
        "teachers/name/:name": "teacherListByName",
        "teachers/name/:name/page/:page": "teacherListByName",
        "teachers/cpf/:cpf": "teacherListByCPF",
        "teachers/cpf/:cpf/page/:page": "teacherListByCPF",
        "teachers/registration/:registration": "teacherListByRegistration",
        "teachers/registration/:registration/page/:page": "teacherListByRegistration",
        "teachers/add": "addTeacher",
        "teachers/:id": "teacherDetails",
        "attendants": "attendantList",
        "attendants/page/:page": "attendantList",
        "attendants/name/:name": "attendantListByName",
        "attendants/name/:name/page/:page": "attendantListByName",
        "attendants/cpf/:cpf": "attendantListByCPF",
        "attendants/cpf/:cpf/page/:page": "attendantListByCPF",
        "attendants/registration/:registration": "attendantListByRegistration",
        "attendants/registration/:registration/page/:page": "attendantListByRegistration",
        "attendants/add": "addAttendant",
        "attendants/:id": "attendantDetails",
        "managers": "managerList",
        "managers/page/:page": "managerList",
        "managers/name/:name": "managerListByName",
        "managers/name/:name/page/:page": "managerListByName",
        "managers/cpf/:cpf": "managerListByCPF",
        "managers/cpf/:cpf/page/:page": "managerListByCPF",
        "managers/registration/:registration": "managerListByRegistration",
        "managers/registration/:registration/page/:page": "managerListByRegistration",
        "managers/add": "addManager",
        "managers/:id": "managerDetails",
        "patients": "patientList",
        "patients/page/:page": "patientList",
        "patients/name/:name": "patientListByName",
        "patients/name/:name/page/:page": "patientListByName",
        "patients/cpf/:cpf": "patientListByCPF",
        "patients/cpf/:cpf/page/:page": "patientListByCPF",
        "patients/add": "addPatient",
        "patients/:id": "patientDetails",
        "patients/:idPatient/treatments": "treatmentList",
        "patients/:idPatient/treatments/add": "addTreatment",
        "patients/:idPatient/treatments/:id": "treatmentDetails",
        "patients/:idPatient/treatments/:idTreatment/sessions": "sessionList",
        "patients/:idPatient/treatments/:idTreatment/sessions/add": "addSession",
        "about": "about"
    },

    initialize: function () {

        var logged = new LoggedTest();
        logged.fetch({
            success: function (data) {
                this.headerView = new HeaderView();
                $('.header').html(this.headerView.el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        selectMenuItem('home-menu');
    },

    wineList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({ success: function () {
            $("#content").html(new WineListView({ model: wineList, page: p }).el);
        }
        });
        selectMenuItem('home-menu');
    },

    wineDetails: function (id) {
        var wine = new Wine({ _id: id });
        wine.fetch({ success: function () {
            $("#content").html(new WineView({ model: wine }).el);
        }
        });
        
    },

    addWine: function () {
        var wine = new Wine();
        $('#content').html(new WineView({ model: wine }).el);
        selectMenuItem('add-menu');
    },




    studentList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var studentList = new StudentCollection();

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('students-menu');
    },

    studentListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByNameCollection({ name: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByCPFCollection({ cpf: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var studentList = new StudentCollection();
        else {
            var studentList = new StudentByRegistrationCollection({ registration: n });
        }

        studentList.fetch({
            success: function () {
                $("#content").html(new StudentListView({ model: studentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    studentDetails: function (id) {
        var student = new Student({ _id: id });
        student.fetch({
            success: function () {
                $("#content").html(new StudentView({ model: student }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addStudent: function () {
        
        var student = new Student();
        $('#content').html(new StudentView({ model: student }).el);
        selectMenuItem('students-menu');

    },



    teacherList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var teacherList = new TeacherCollection();

        teacherList.fetch({
            success: function () {
                $("#content").html(new TeacherListView({ model: teacherList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('teachers-menu');
    },

    teacherListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var teacherList = new TeacherCollection();
        else {
            var teacherList = new TeacherByNameCollection({ name: n });
        }

        teacherList.fetch({
            success: function () {
                $("#content").html(new TeacherListView({ model: teacherList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    teacherListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var teacherList = new TeacherCollection();
        else {
            var teacherList = new TeacherByCPFCollection({ cpf: n });
        }

        teacherList.fetch({
            success: function () {
                $("#content").html(new TeacherListView({ model: teacherList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    teacherListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var teacherList = new TeacherCollection();
        else {
            var teacherList = new TeacherByRegistrationCollection({ registration: n });
        }

        teacherList.fetch({
            success: function () {
                $("#content").html(new TeacherListView({ model: teacherList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    teacherDetails: function (id) {
        var teacher = new Teacher({ _id: id });
        teacher.fetch({
            success: function () {
                $("#content").html(new TeacherView({ model: teacher }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addTeacher: function () {

        var teacher = new Teacher();
        $('#content').html(new TeacherView({ model: teacher }).el);
        selectMenuItem('teachers-menu');

    },



    attendantList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var attendantList = new AttendantCollection();

        attendantList.fetch({
            success: function () {
                $("#content").html(new AttendantListView({ model: attendantList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('attendants-menu');
    },

    attendantListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var attendantList = new AttendantCollection();
        else {
            var attendantList = new AttendantByNameCollection({ name: n });
        }

        attendantList.fetch({
            success: function () {
                $("#content").html(new AttendantListView({ model: attendantList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    attendantListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var attendantList = new AttendantCollection();
        else {
            var attendantList = new AttendantByCPFCollection({ cpf: n });
        }

        attendantList.fetch({
            success: function () {
                $("#content").html(new AttendantListView({ model: attendantList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    attendantListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var attendantList = new AttendantCollection();
        else {
            var attendantList = new AttendantByRegistrationCollection({ registration: n });
        }

        attendantList.fetch({
            success: function () {
                $("#content").html(new AttendantListView({ model: attendantList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    attendantDetails: function (id) {
        var attendant = new Attendant({ _id: id });
        attendant.fetch({
            success: function () {
                $("#content").html(new AttendantView({ model: attendant }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addAttendant: function () {

        var attendant = new Attendant();
        $('#content').html(new AttendantView({ model: attendant }).el);
        selectMenuItem('attendants-menu');

    },



    managerList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var managerList = new ManagerCollection();

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('managers-menu');
    },

    managerListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByNameCollection({ name: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByCPFCollection({ cpf: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerListByRegistration: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var managerList = new ManagerCollection();
        else {
            var managerList = new ManagerByRegistrationCollection({ registration: n });
        }

        managerList.fetch({
            success: function () {
                $("#content").html(new ManagerListView({ model: managerList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    managerDetails: function (id) {
        var manager = new Manager({ _id: id });
        manager.fetch({
            success: function () {
                $("#content").html(new ManagerView({ model: manager }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addManager: function () {

        var manager = new Manager();
        $('#content').html(new ManagerView({ model: manager }).el);
        selectMenuItem('managers-menu');

    },



    patientList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var patientList = new PatientCollection();

        patientList.fetch({
            success: function () {
                $("#content").html(new PatientListView({ model: patientList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('patients-menu');
    },

    patientListByName: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var patientList = new PatientCollection();
        else {
            var patientList = new PatientByNameCollection({ name: n });
        }

        patientList.fetch({
            success: function () {
                $("#content").html(new PatientListView({ model: patientList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    patientListByCPF: function (n, page) {
        var n = n == null ? '' : n;
        var p = page ? parseInt(page, 10) : 1;

        if (n.length == 0)
            var patientList = new PatientCollection();
        else {
            var patientList = new PatientByCPFCollection({ cpf: n });
        }

        patientList.fetch({
            success: function () {
                $("#content").html(new PatientListView({ model: patientList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    patientDetails: function (id) {
        var patient = new Patient({ _id: id });
        patient.fetch({
            success: function () {
                $("#content").html(new PatientView({ model: patient }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },

    addPatient: function () {

        var patient = new Patient();
        $('#content').html(new PatientView({ model: patient }).el);
        selectMenuItem('patients-menu');

    },

    treatmentList: function (idPatient, page) {
        var p = page ? parseInt(page, 10) : 1;
        var treatmentList = new TreatmentCollection(idPatient.valueOf());
        treatmentList.fetch({
            success: function () {
                $("#content").html(new TreatmentListView({ model: treatmentList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('patients-menu');
    },

    addTreatment: function (idPatient) {
        var treatment = new Treatment(idPatient);
        $('#content').html(new TreatmentView({ model: treatment }).el);
        selectMenuItem('patients-menu');

    },

    treatmentDetails: function (idPatient, id) {

        var treatment = new TreatmentDetail(idPatient, id );
        treatment.fetch({
            success: function () {
                $("#content").html(new TreatmentView({ model: treatment }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem();
    },


    sessionList: function (idPatient, idTreatment, page) {
        var p = page ? parseInt(page, 10) : 1;
        var sessionList = new SessionCollection(idPatient.valueOf(), idTreatment.valueOf());
        sessionList.fetch({
            success: function () {
                $("#content").html(new SessionListView({ model: sessionList, page: p }).el);
            },
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });
        selectMenuItem('patients-menu');
    },

    addSession: function (idPatient, idTreatment) {
        var session = new Session(idPatient.valueOf(), idTreatment.valueOf());
        $('#content').html(new SessionView({ model: session }).el);
        selectMenuItem('patients-menu');

    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'WineView', 'WineListItemView', 'StudentsView', 'StudentView', 'TeachersView', 'TeacherView', 'AttendantsView', 'AttendantView', 'ManagersView', 'ManagerView', 'PatientsView', 'PatientView', 'TreatmentsView', 'TreatmentView', 'SessionsView', 'SessionView', 'AboutView', 'BaseModalView'], function () {
    app = new AppRouter();
    Backbone.history.start();
});

function selectMenuItem(menuItem) {
    if (menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }
}