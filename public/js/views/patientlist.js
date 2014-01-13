window.PatientListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        var patients = this.model.models;
        var len = patients.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);
        var html = '';
        var jsonObject = '';



        $(this.el).html(new PatientsView().render().el);

        if (len > 0) {
            for (var i = startPos; i < endPos; i++) {


                jsonObject = patients[i].toJSON();



                html += '<tr>';
                html += '<td>' + jsonObject._id + '</td>';
                html += '<td><a href="#patients/' + jsonObject._id + '">' + jsonObject.name + '</td>';
                
                if (jsonObject.dateBirth != null)
                    html += '<td>' + formattedDate(jsonObject.dateBirth) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.cpf != null)
                    html += '<td>' + jsonObject.cpf + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.dateInclusion != null)
                    html += '<td>' + formattedDate(jsonObject.dateInclusion) + '</td>';
                else
                    html += '<td></td>';

                if (jsonObject.sex != null)
                    html += '<td>' + jsonObject.sex + '</td>';
                else
                    html += '<td></td>';

                html += '</tr>';
            }

            $('#tbPatients > tbody:last', this.el).append(html);
            $(this.el).append(new PatientsPaginator({ model: this.model, page: this.options.page }).render().el);
        }
        return this;
    }
});

window.PatientsView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});

window.PatientsPaginator = Backbone.View.extend({

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