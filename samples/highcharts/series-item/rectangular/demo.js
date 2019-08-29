Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Rectangular view'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y'],
        data: [
            ['Conservative', 318],
            ['Labour', 262],
            ['Scottish National Party', 35],
            ['Liberal Democrat', 12],
            ['Democratic Unionist Party', 10],
            ['Sinn Fein', 7],
            ['Plaid Cymru', 4],
            ['Green Party', 1],
            ['Others', 1]
        ]
    }]

});
