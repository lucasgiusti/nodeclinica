window.SessionListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var patient = this.model;
        patient = patient.toJSON()[0];
        var treatment = patient.treatments[0];
        var sessions = patient.treatments[0].sessions;


        var len = sessions.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        var html = '';
        var jsonObject = '';



        $(this.el).html(new SessionsView().render().el);

        if (len > 0) {

            var aux;
            var acabou = false;
            while (!acabou) {
                acabou = true;
                for (var i = 1; i < sessions.length; i++) {
                    if (sessions[i - 1].dateSchedulingStart < sessions[i].dateSchedulingStart) {
                        aux = sessions[i];
                        sessions[i] = sessions[i - 1];
                        sessions[i - 1] = aux;
                        acabou = false;
                    }
                }
            }

            for (var i = startPos; i < endPos; i++) {
                jsonObject = sessions[i];

                html += '<tr>';
                html += '<td><a href="#patients/' + patient._id + '/treatments/' + treatment._id + '/sessions/' + jsonObject._id + '">' + jsonObject.typeSession + '</td>';
                
                if (jsonObject.dateSchedulingStart != null)
                    html += '<td>' + formattedDateTime(jsonObject.dateSchedulingStart) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateSchedulingEnd != null)
                    html += '<td>' + formattedDateTime(jsonObject.dateSchedulingEnd) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.studentName != null)
                    html += '<td>' + jsonObject.studentName + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.everHeld)
                    html += '<td>REALIZADA</td>';
                else if (jsonObject.canceledSession)
                    html += '<td>CANCELADA</td>';
                else
                    html += '<td>ABERTA</td>';

                html += '</tr>';

            }

            $('#tbSessions > tbody:last', this.el).append(html);
            $(this.el).append(new SessionsPaginator({ model: this.model, page: this.options.page }).render().el);
        }
        $('legend', this.el).append(patient.name);

        return this;
    }
});

window.SessionsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.SessionsPaginator = Backbone.View.extend({

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