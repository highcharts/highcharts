const country = {
    Norway: 'no',
    'United States': 'us',
    Germany: 'de',
    Canada: 'ca',
    Austria: 'at'
};

Highcharts.chart('container', {
    colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
    country: {
        Norway: 'no',
        'United States': 'us',
        Germany: 'de',
        Canada: 'ca',
        Austria: 'at'
    },
    chart: {
        type: 'column',
        inverted: true,
        polar: true
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        }
    },
    title: {
        text: 'Winter Olympic medals per existing country (TOP 5)'
    },
    tooltip: {
        outside: true
    },
    pane: {
        size: '85%',
        innerSize: '20%',
        endAngle: 270
    },
    xAxis: {
        tickInterval: 1,
        labels: {
            align: 'right',
            useHTML: true,
            allowOverlap: true,
            step: 1,
            y: 3,
            style: {
                fontSize: '13px'
            },
            formatter: function () {
                return `${
                    this.value
                } <span class='f16'><span id='flag' class='flag ${
                    country[this.value]
                }'></span></span>`;
            }
        },
        lineWidth: 0,
        categories: ['Norway', 'United States', 'Germany', 'Canada', 'Austria'],
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        crosshair: {
            enabled: true,
            color: '#333'
        },
        lineWidth: 0,
        tickInterval: 25,
        reversedStacks: false,
        endOnTick: true,
        showLastLabel: true,
        accessibility: {
            description: 'Number of medals'
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15
        }
    },
    series: [
        {
            name: 'Gold medals',
            data: [132, 105, 92, 73, 64]
        },
        {
            name: 'Silver medals',
            data: [125, 110, 86, 64, 81]
        },
        {
            name: 'Bronze medals',
            data: [111, 90, 60, 62, 87]
        }
    ]
});
