Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Rectangular view with specific row count'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
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
        ],
        rows: 16
    }]

});
