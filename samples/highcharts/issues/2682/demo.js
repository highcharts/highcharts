$(function () {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            type: 'column'
        },

        title: {
            text: 'Highcharts <= 3.0.9: Couldn\'t update from percent to normal stack'
        },
        series: [{
            stacking: 'percent',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
        }, {
            stacking: 'percent',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0].reverse()
        }]
    }, function () {

        this.series[0].update({ stacking: 'normal' }, false);
        this.series[1].update({ stacking: 'normal' }, false);
        this.redraw();
    });


});