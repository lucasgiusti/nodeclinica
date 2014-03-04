window.SessionListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {

        var patient = this.model.models;
        patient = patient[0].toJSON();
        var sessions = patient.sessions;

        var len = sessions.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        var html = '';
        var jsonObject = '';



        $(this.el).html(new SessionsView().render().el);

        if (len > 0) {
            for (var i = startPos; i < endPos; i++) {


                jsonObject = sessions[i];

                html += '<tr>';
                html += '<td>' + jsonObject._id + '</td>';
                html += '<td><a href="#patients/' + patient._id  + '/sessions/' + jsonObject._id + '">' + jsonObject.serviceArea + '</td>';
                
                if (jsonObject.dateStart != null)
                    html += '<td>' + formattedDate(jsonObject.dateStart) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateEnd != null)
                    html += '<td>' + formattedDate(jsonObject.dateEnd) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.status != null)
                    html += '<td>' + jsonObject.status + '</td>';
                else
                    html += '<td></td>';

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