Highcharts.chart('container', {
    colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
    chart: {
        type: 'column',
        inverted: true,
        polar: true
    },
    title: {
        text: 'Winter Olympic medals per existing country (TOP 10)'
    },
    tooltip: {
        outside: true
    },
    pane: {
        size: '85%',
        endAngle: 270
    },
    xAxis: {
        tickInterval: 1,
        labels: {
            align: 'right',
            useHTML: true,
            allowOverlap: true,
            step: 1,
            y: 4,
            style: {
                fontSize: '12px'
            }
        },
        lineWidth: 0,
        categories: [
            'Norway <span class="f16"><span id="flag" class="flag no">' +
            '</span></span>',
            'United States <span class="f16"><span id="flag" class="flag us">' +
            '</span></span>',
            'Germany <span class="f16"><span id="flag" class="flag de">' +
            '</span></span>',
            'Canada <span class="f16"><span id="flag" class="flag ca">' +
            '</span></span>',
            'Austria <span class="f16"><span id="flag" class="flag at">' +
            '</span></span>',
            'Sweden <span class="f16"><span id="flag" class="flag se">' +
            '</span></span>',
            'Switzerland <span class="f16"><span id="flag" class="flag ch">' +
            '</span></span>',
            'Russia <span class="f16"><span id="flag" class="flag ru">' +
            '</span></span>',
            'Netherlands <span class="f16"><span id="flag" class="flag nl">' +
            '</span></span>',
            'Finland <span class="f16"><span id="flag" class="flag fi">' +
            '</span></span>'
        ]
    },
    yAxis: {
        lineWidth: 0,
        tickInterval: 25,
        reversedStacks: false,
        endOnTick: true,
        showLastLabel: true
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15
        }
    },
    series: [{
        name: 'Gold medals',
        data: [132, 105, 92, 73, 64, 57, 55, 47, 45, 43]
    }, {
        name: 'Silver medals',
        data: [125, 110, 86, 64, 81, 46, 46, 38, 44, 63]
    }, {
        name: 'Bronze medals',
        data: [111, 90, 60, 62, 87, 55, 52, 35, 41, 61]
    }]
});