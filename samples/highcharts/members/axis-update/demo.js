const chart = Highcharts.chart('container', {
    title: {
        text: 'Axis.update() demo'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});

const types = ['linear', 'datetime', 'logarithmic'];
let type = 1,
    opposite = true,
    lineWidth = 2,
    lineColor = 'red';

document.getElementById('toggle-type').addEventListener('click', () => {
    chart.yAxis[0].update({
        type: types[type]
    });
    type += 1;
    if (type === types.length) {
        type = 0;
    }
});

document.getElementById('toggle-opposite').addEventListener('click', () => {
    chart.yAxis[0].update({
        opposite: opposite
    });
    opposite = !opposite;
});

document.getElementById('toggle-linewidth').addEventListener('click', () => {
    chart.yAxis[0].update({
        lineWidth: lineWidth
    });
    lineWidth = (lineWidth + 2) % 4;
});

document.getElementById('toggle-linecolor').addEventListener('click', () => {
    chart.yAxis[0].update({
        lineColor: lineColor
    });
    lineColor = { red: 'blue', blue: 'red' }[lineColor];
});
