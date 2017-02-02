
var chart = Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Legend update'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [1, 4, 3, 5],
        name: 'First'
    }, {
        data: [5, 3, 4, 2],
        name: 'Second'
    }, {
        data: [7, 5, 8, 6],
        name: 'Third'
    }]
});

var i = 0;

$('#update-legend').click(function () {
    chart.legend.update(i++ % 2 ? {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
            fontSize: '1em',
            fontStyle: 'normal',
            fontWeight: 'bold'
        },
        symbolRadius: 0,
        symbolWidth: 16
    } : {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
            fontSize: '1.2em',
            fontStyle: 'italic',
            fontWeight: 'normal'
        },
        symbolRadius: 6,
        symbolWidth: 12
    });
});