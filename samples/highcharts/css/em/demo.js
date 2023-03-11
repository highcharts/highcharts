const chart = Highcharts.chart('container', {
    chart: {
        animation: false,
        styledMode: true
    },
    title: {
        text: 'Relative fonts and lines'
    },
    subtitle: {
        text: 'Use the slider below the chart to set top-level font size'
    },
    xAxis: {
        categories: ['Rain', 'Snow', 'Sun', 'Wind']
    },
    series: [{
        data: [324, 124, 547, 221],
        type: 'column'
    }, {
        data: [698, 675, 453, 543]
    }]
});

document.getElementById('em').addEventListener('input', e =>  {
    chart.container.style.fontSize = e.target.value + 'em';

    chart.redraw(false);
});