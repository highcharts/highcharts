Highcharts.chart('container', {

    chart: {
        type: 'column',
        styledMode: true
    },

    title: {
        text: 'Average weight and BMI in some countries, women',
        align: 'left'
    },

    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.worlddata.info/average-bodyheight.php"' +
            'target="_blank">WorldData</a>',
        align: 'left'
    },

    xAxis: {
        categories: ['Tokelau', 'Ireland', 'Italy', 'Timor-Leste']
    },

    yAxis: [{ // Primary axis
        className: 'highcharts-color-0',
        title: {
            text: 'Weight'
        }
    }, { // Secondary axis
        className: 'highcharts-color-1',
        opposite: true,
        title: {
            text: 'BMI'
        }
    }],

    plotOptions: {
        column: {
            borderRadius: 5
        }
    },

    series: [{
        name: 'Weight',
        data: [92.5, 73.1, 64.8, 49.0],
        tooltip: {
            valueSuffix: ' kg'
        }
    }, {
        name: 'BMI',
        data: [33.7, 27.1, 24.9, 21.2],
        yAxis: 1
    }]

});
