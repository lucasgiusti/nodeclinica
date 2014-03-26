window.CalendarView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());

        Backbone.history

        this.carregaAlunos();
        this.carregaProfessores();

        return this;
    },

    events: {
        "change": "change"
    },

    change: function (event) {
        var target = event.target;
        
        if (target.name == "studentId") {
            $("#teacherId option")
            .removeAttr('selected')
            .find(':first')     //you can also use .find('[value=MyVal]')
            .attr('selected', 'selected');
        }
        else {
            $("#studentId option")
            .removeAttr('selected')
            .find(':first')     //you can also use .find('[value=MyVal]')
            .attr('selected', 'selected');
        }

        this.carregaAgenda(target.name, target.value);
    },

    carregaAgenda: function (type, id) {

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
        
        $("#calendar", this.el).html('');
        $("#calendar", this.el).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title'
            },
            
            defaultView: 'agendaWeek',
            editable: false,
            contentHeight: 400,
            ignoreTimezone: false,
            events: function (start, end, callback)
            {
                $.getJSON('sessions/' + id + '/type/' + type + '', function (data) {
                    var events = [];

                    $.each(data, function (key, val) {
                        var idPatient = val._id;
                        $.each(val.treatments, function (key, val) {data
                            var idTreatment = val._id;
                            
                            $.each(val.sessions, function (key, val) {

                                events.push({
                                    title: val.typeSession,
                                    start:  val.dateSchedulingStart,
                                    end: val.dateSchedulingEnd,
                                    url: '#patients/' + idPatient + '/treatments/' + idTreatment + '/sessions/' + val._id
                                });
                                
                                });

                        });


                    });
                    callback(events);
                });
            }
/*
            events: {
                url: 'sessions/' + id + '/type/' + type + '',
                type: 'GET',
                data: {
                    custom_param1: dateSchedulingStart,
                    custom_param2: dateSchedulingEnd
                },
                error: function() {
                    alert('there was an error while fetching events!');
                },
                color: 'yellow',   // a non-ajax option
                textColor: 'black' // a non-ajax option
            }



            events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, d , 19, 0),
                    end: new Date(y, m, d, 20, 00),
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d - 5, 19, 0),
                    end: new Date(y, m, d - 5, 20, 00),
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date(y, m, d - 3, 16, 0),
                    allDay: false
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: new Date(y, m, d + 4, 16, 0),
                    allDay: false
                },
                {
                    title: 'Meeting',
                    start: new Date(y, m, d, 10, 30),
                    allDay: false
                },
                {
                    title: 'Birthday Party',
                    start: new Date(y, m, d + 1, 19, 0),
                    end: new Date(y, m, d + 1, 20, 00),
                    allDay: false
                },
                {
                    title: 'Click for Google',
                    start: new Date(y, m, 28, 11, 0),
                    end: new Date(y, m, 28, 12, 00),
                    url: 'http://google.com/'
                }
            ]
*/

        })

        
    },

    carregaAlunos: function () {

        $.getJSON('students', function (data) {
            var options = '';

            options = '<option value="null"></option>';
            $.each(data, function (key, val) {

                options += '<option value="' + val._id + '">' + val.name + '</option>';
            });

            var html = '';
            html += '<select class="form-control" id="studentId" name="studentId">';
            html += options;
            html += '</select>';
            html += '<span class="help-inline"></span>';
            $('#divAlunos', this.el).append(html);
        });
    },

    carregaProfessores: function () {

        $.getJSON('teachers', function (data) {
            var options = '';

            options = '<option value="null"></option>';
            $.each(data, function (key, val) {

                options += '<option value="' + val._id + '">' + val.name + '</option>';
            });

            html = '';
            html += '<select class="form-control" id="teacherId" name="teacherId">';
            html += options;
            html += '</select>';
            html += '<span class="help-inline"></span>';
            $('#divProfessores', this.el).append(html);
        });
    },

});