window.CalendarView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());


        this.carregaAgenda();

        return this;
    },


    carregaAgenda: function () {

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
        $("#calendar", this.el).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title'
            },
            
            defaultView: 'agendaWeek',
            editable: false,
            contentHeight: 445,
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
        })

        
    }

});