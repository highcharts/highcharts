(async () => {

    // Override a member of a module, which in turn will be imported into
    // subsequent modules.
    const Templating = await import(
        'https://code.highcharts.com/es-modules/Core/Templating.js'
    );
    const numberFormat = Templating.default.numberFormat;
    Templating.default.numberFormat = function () {
        const n = numberFormat.apply(this, arguments);
        return '~' + n;
    };

    const { default: Highcharts } = await import(
        'https://code.highcharts.com/es-modules/masters/highcharts.src.js'
    );
    await import(
        'https://code.highcharts.com/es-modules/masters/modules/exporting.src.js'
    );

    Highcharts.chart('container', {
        title: {
            text: 'Extending members of ES modules'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ],
            dataLabels: {
                enabled: true
            },
            pointStart: '2022-01-01',
            pointIntervalUnit: 'day'
        }]
    });
})();