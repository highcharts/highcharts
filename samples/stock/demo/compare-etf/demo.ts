(async () => {

    const PERIOD_CAP = 22.1,
        PERIOD_BUFFER = 6.5;

    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@25f540deda/samples/data/etfs.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Index vs buffer ETF comparison'
        },

        rangeSelector: {
            enabled: false
        },

        navigator: {
            enabled: false
        },

        scrollbar: {
            enabled: false
        },

        legend: {
            enabled: true,
            verticalAlign: 'top',
            align: 'left'
        },

        xAxis: {
            accessibility: {
                description: 'Datetime axis'
            }
        },

        yAxis: {
            labels: {
                format: '{#if (gt value 0)}+{/if}{value}%'
            },
            opposite: false,
            plotLines: [{
                value: PERIOD_CAP,
                width: 2,
                color: 'rgba(152, 251, 152, 0.4)',
                dashStyle: 'Dash',
                label: {
                    align: 'left',
                    text: `OUTCOME PERIOD CAP: ${PERIOD_CAP}%`,
                    x: 0,
                    style: {
                        color: '#006666',
                        fontWeight: 'bold'
                    }
                }
            }, {
                value: -PERIOD_BUFFER,
                width: 2,
                color: 'rgba(175, 238, 238, 0.6)',
                dashStyle: 'Dash',
                label: {
                    align: 'left',
                    verticalAlign: 'bottom',
                    text: `OUTCOME PERIOD BUFFER: ${PERIOD_BUFFER}%`,
                    x: 0,
                    y: 13,
                    style: {
                        color: '#007979',
                        fontWeight: 'bold'
                    }
                }
            }, {
                value: 0,
                width: 2,
                dashStyle: 'ShortDot'
            }],
            plotBands: [{
                from: 0,
                to: PERIOD_CAP,
                color: 'rgba(152, 251, 152, 0.4)'
            }, {
                from: 0,
                to: -PERIOD_BUFFER,
                color: 'rgba(175, 238, 238, 0.6)'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                        '{series.name}</br> <b>{point.y} EUR</b> ' +
                        '({point.change}%)<br/>',
            valueDecimals: 2,
            split: false,
            fixed: true
        },

        series: [{
            name: 'iShares Core S&P 500 UCITS ETF',
            data: data.CSPX
        }, {
            name: 'Example Buffer ETF',
            data: data.Other
        }]
    });

})();