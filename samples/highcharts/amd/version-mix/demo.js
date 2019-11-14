// Tell RequireJS how and where to search for the highcharts package
require.config({
    packages: [{
        name: 'highcharts6',
        main: 'highcharts'
    }, {
        name: 'highcharts7',
        main: 'highcharts'
    }, {
        name: 'highcharts',
        main: 'highcharts'
    }],
    paths: {
        highcharts6: 'https://code.highcharts.com/6.2',
        highcharts7: 'https://code.highcharts.com/7.0.3',
        highcharts: (
            location.host === 'utils.highcharts.local' ?
                'http://code.highcharts.local' :
                'https://code.highcharts.com'
        )
    }
});

// Load the depedencies and create your charts

require(

    [
        'highcharts6',
        'highcharts6/modules/exporting',
        'highcharts6/modules/accessibility'
    ],

    function (Highcharts, ExportingModule, AccessibilityModule) {

        ExportingModule(Highcharts);
        AccessibilityModule(Highcharts);

        Highcharts.chart('container6', {
            title: {
                text: 'My chart in v' + Highcharts.version
            },
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        });

    }

);

require(

    [
        'highcharts7',
        'highcharts7/modules/exporting',
        'highcharts7/modules/accessibility'
    ],

    function (Highcharts, ExportingModule, AccessibilityModule) {

        ExportingModule(Highcharts);
        AccessibilityModule(Highcharts);

        Highcharts.chart('container7', {
            title: {
                text: 'My chart in v' + Highcharts.version
            },
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        });

    }

);

require(

    [
        'highcharts',
        'highcharts/modules/exporting',
        'highcharts/modules/accessibility'
    ],

    function (Highcharts, ExportingModule, AccessibilityModule) {

        ExportingModule(Highcharts);
        AccessibilityModule(Highcharts);

        Highcharts.chart('container', {
            title: {
                text: 'My chart in the latest version'
            },
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        });

    }

);
