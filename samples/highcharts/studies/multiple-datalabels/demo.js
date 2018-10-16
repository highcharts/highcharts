
Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Multiple datalabels per point'
    },

    subtitle: {
        text: 'Highcharts circle relation chart'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                inside: true
            }
        }
    },

    series: [{
    //    type: 'pie',
        dataLabels: [{
            verticalAlign: 'top',
            format: '{point.name}'
        }, {
            verticalAlign: 'bottom',
            format: '{y}'
        }],
        data: [{
            y: 12,
            name: 'bob',
            dataLabels: {
                color: 'red'
            }
        }, {
            y: 12,
            name: 'john'
        }, {
            y: 11,
            name: 'bob'
        }, {
            y: 12,
            name: 'john'
        }, {
            y: 11,
            name: 'bob'
        }, {
            y: 11,
            name: 'john'
        }, {
            y: 12,
            name: 'bob'
        }, {
            y: 11,
            name: 'john'
        }, {
            y: 11,
            name: 'bob'
        }, {
            y: 11,
            name: 'john'
        }, {
            y: 12,
            name: 'bob'
        }, {
            y: 11,
            name: 'john'
        }]
    }]

});
