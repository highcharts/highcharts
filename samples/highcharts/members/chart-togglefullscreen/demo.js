const chart = Highcharts.chart('container', {
    credits: {
        enabled: false
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }],

    navigation: {
        buttonOptions: {
            enabled: false
        }
    }
});

const eventCount = el => {
    let count = 0;
    // eslint-disable-next-line
    for (const t in el.hcEvents) {
        count += el.hcEvents[t].length;
    }
    return count;
};

const before = eventCount(chart);

// The button handlers
document.getElementById('button-fullscreen').addEventListener(
    'click',
    () => chart.fullscreen.toggle()
);

let isWide = true;
document.getElementById('button-resize').addEventListener('click', function () {
    chart.container.parentElement.style.width = isWide ? '300px' : '600px';
    isWide = !isWide;

    // It should not leak event listeners
    if (eventCount(chart) !== before) {
        console.error('Leaked event listeners!');
    }
});
