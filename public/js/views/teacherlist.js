﻿window.TeacherListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var teachers = this.model.models;
        var len = teachers.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        var html = '';
        var jsonObject = '';



        $(this.el).html(new TeachersView().render().el);

        if (len > 0) {
            for (var i = startPos; i < endPos; i++) {


                jsonObject = teachers[i].toJSON();



                html += '<tr>';
                html += '<td>' + jsonObject._id + '</td>';
                html += '<td><a href="#teachers/' + jsonObject._id + '">' + jsonObject.name + '</td>';
                html += '<td>' + jsonObject.registration + '</td>';

                if (jsonObject.cpf != null)
                    html += '<td>' + jsonObject.cpf + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateInclusion != null)
                    html += '<td>' + formattedDate(jsonObject.dateInclusion) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.active)
                    html += '<td>Sim</td>';
                else
                    html += '<td>Não</td>';

                html += '</tr>';
            }

            $('#tbTeachers > tbody:last', this.el).append(html);
            $(this.el).append(new TeachersPaginator({ model: this.model, page: this.options.page }).render().el);
        }
        return this;
    }
});

window.TeachersView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.TeachersPaginator = Backbone.View.extend({

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render: function () {

        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 8);

        var options = {
            currentPage: this.options.page,
            totalPages: pageCount,
            size: "normal",
            alignment: "center",
            pageUrl: function (type, page, current) {

                var url = window.location.href;

                if (url.indexOf('page', 4) > -1) {
                    url = url.substring(0, url.lastIndexOf('/') + 1) + page;
                }
                else {

                    url += "/page/" + page;
                }


                return url;

            }
        }

        $(this.el).bootstrapPaginator(options);

        return this;
    }
});