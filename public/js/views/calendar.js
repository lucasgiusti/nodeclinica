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
                events: function (start, end, callback) {
                    $.getJSON('sessions/' + id + '/type/' + type + '', function (data) {
                        var events = [];
                                var grupos = [];
                                window.htmlGrupos = [];
                        $.each(data, function (key, val) {
                            var idPatient = val._id;
                            var patientName = val.name;
                            $.each(val.treatments, function (key, val) {
                                data
                                var idTreatment = val._id;

                                $.each(val.sessions, function (key, val) {


                                if(val.typeService == 'INDIVIDUAL')
                                {
                                    events.push({
                                        title: val.typeSession,
                                        start: val.dateSchedulingStart,
                                        end: val.dateSchedulingEnd,
                                        url: '#patients/' + idPatient + '/treatments/' + idTreatment + '/sessions/' + val._id
                                    });
                                }
                                else
                                {
                                    var existeGrupo = false;

                                    for(var i= 0; i < grupos.length;i++)
                                    {
                                        if(grupos[i] == (val.typeSession + '#' + val.dateSchedulingStart + '#' + val.dateSchedulingEnd))
                                        { 
                                            var vlink = '#patients/' + idPatient + '/treatments/' + idTreatment + '/sessions/' + val._id;
                                            htmlGrupos[i] += '<tr><td><a href=javascript:linkGrupoSessao("' + vlink + '")>' + patientName + '</a></td></tr>';
                                            existeGrupo = true;
                                        }
                                    }
                                
                                    if(!existeGrupo)
                                    {
                                        var vlink = '#patients/' + idPatient + '/treatments/' + idTreatment + '/sessions/' + val._id;

                                        window.htmlGrupos.push('<tr><td><a href=javascript:linkGrupoSessao("' + vlink + '")>' + patientName + '</a></td></tr>');
                                        grupos.push(val.typeSession + '#' + val.dateSchedulingStart + '#' + val.dateSchedulingEnd);
                                
                                        events.push({
                                            title: 'GRUPO',
                                            start: val.dateSchedulingStart,
                                            end: val.dateSchedulingEnd,
                                            url: "PopSessao" + (grupos.length-1)
                                        });
                                    }
                                }
                                });
                                });
                                
                            });
                        callback(events);
                        
                    });
                }
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
