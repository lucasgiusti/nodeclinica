function signin() {
    window.location.assign("signin.html");
    //res.redirect('/signin.html');
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
        "students/:id": "studentDetails",
        "teachers": "teacherList",
        "teachers/page/:page": "teacherList",
        "teachers/name/:name": "teacherListByName",
        "teachers/name/:name/page/:page": "teacherListByName",
        "teachers/cpf/:cpf": "teacherListByCPF",
        "teachers/cpf/:cpf/page/:page": "teacherListByCPF",
        "teachers/registration/:registration": "teacherListByRegistration",
        "teachers/registration/:registration/page/:page": "teacherListByRegistration",
        "attendants": "attendantList",
        "attendants/page/:page": "attendantList",
        "attendants/name/:name": "attendantListByName",
        "attendants/name/:name/page/:page": "attendantListByName",
        "attendants/cpf/:cpf": "attendantListByCPF",
        "attendants/cpf/:cpf/page/:page": "attendantListByCPF",
        "attendants/registration/:registration": "attendantListByRegistration",
        "attendants/registration/:registration/page/:page": "attendantListByRegistration",
        "managers": "managerList",
        "managers/page/:page": "managerList",
        "managers/name/:name": "managerListByName",
        "managers/name/:name/page/:page": "managerListByName",
        "managers/cpf/:cpf": "managerListByCPF",
        "managers/cpf/:cpf/page/:page": "managerListByCPF",
        "managers/registration/:registration": "managerListByRegistration",
        "managers/registration/:registration/page/:page": "managerListByRegistration",
        "patients": "patientList",
        "patients/page/:page": "patientList",
        "patients/name/:name": "patientListByName",
        "patients/name/:name/page/:page": "patientListByName",
        "patients/cpf/:cpf": "patientListByCPF",
        "patients/cpf/:cpf/page/:page": "patientListByCPF",
        "about": "about"
    },

    initialize: function () {

        var logged = new LoggedTest();
        logged.fetch({
            error: function (err, message) {
                var erro = $.parseJSON(message.responseText).status;
                if (erro == 401) {
                    signin();
                }
            }
        });

        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    wineList: function (page) {
        var p = page ? parseInt(page, 10) : 1;
        var wineList = new WineCollection();
        wineList.fetch({ success: function () {
            $("#content").html(new WineListView({ model: wineList, page: p }).el);
        }
        });
        this.headerView.selectMenuItem('home-menu');
    },

    wineDetails: function (id) {
        var wine = new Wine({ _id: id });
        wine.fetch({ success: function () {
            $("#content").html(new WineView({ model: wine }).el);
        }
        });
        this.headerView.selectMenuItem();
    },

    addWine: function () {
        var wine = new Wine();
        $('#content').html(new WineView({ model: wine }).el);
        this.headerView.selectMenuItem('add-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem();
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
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
        this.headerView.selectMenuItem('home-menu');
    },



    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'WineView', 'WineListItemView', 'StudentsView', 'StudentView', 'TeachersView', 'AttendantsView', 'ManagersView', 'PatientsView', 'AboutView', 'BaseModalView'], function () {
    app = new AppRouter();
    Backbone.history.start();
});