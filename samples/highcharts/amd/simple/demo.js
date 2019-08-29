// Tell RequireJS how and where to search for the highcharts package
require.config({
    packages: [{
        name: 'highcharts',
        main: 'highcharts'
    }],
    paths: {
        // Change this to your server if you do not wish to use our CDN.
        highcharts: 'https://code.highcharts.com'
    }
});

// Load the depedencies and create your chart
require(

    [
        'highcharts',
        'highcharts/modules/exporting',
        'highcharts/modules/accessibility'
    ],

    // This function runs when the above files have been loaded.
    function (Highcharts, ExportingModule, AccessibilityModule) {

        // We need to initialize module files and pass in Highcharts.
        ExportingModule(Highcharts);

        // Load accessibility after exporting.
        AccessibilityModule(Highcharts);

        // Create a test chart.
        Highcharts.chart('container', {
            colors: ['#39F', '#06C', '#9F3', '#6C0'],
            title: {
                text: 'My AMD-loaded chart'
            },
            series: [{
                name: 'Sky',
                type: 'areaspline',
                data: [25, 25, 25, 25, 25],
                animation: 250
            }, {
                name: 'City',
                type: 'areaspline',
                data: [10, 15, 13, 11, 12],
                animation: {
                    duration: 500
                }
            }, {
                name: 'Hill',
                type: 'areaspline',
                data: [10, 15, 13, 11, 10],
                animation: {
                    duration: 750
                }
            }, {
                name: 'Field',
                type: 'areaspline',
                data: [1, 2, 3, 4, 5],
                animation: {
                    duration: 1000
                }
            }]
        });

    }

);
