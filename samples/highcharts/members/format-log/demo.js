// Log the context
Highcharts.Templating.helpers.log = function () {
    console.log(arguments[0].ctx);
};

// Debug
Highcharts.Templating.helpers.debug = function () {
    // eslint-disable-next-line no-debugger
    debugger;
};


Highcharts.chart('container', {

    title: {
        text: 'Format with logging'
    },

    subtitle: {
        text: 'Open the console to inspect the context of each format'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar']
    },

    plotOptions: {
        series: {
            dataLabels: [{
                enabled: true,
                format: '{log} {y}'
                // format: '{debug} {y}'
            }]
        }
    },

    series: [{
        name: 'Temperature',
        type: 'line',
        data: [-13.6, -14.9, -5.8]
    }]
});