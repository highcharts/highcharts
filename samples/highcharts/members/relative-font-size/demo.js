const chart = Highcharts.chart('container', {
    chart: {
        animation: false
    },
    title: {
        text: 'Root font size: 1rem'
    },
    subtitle: {
        text: 'Use the slider below the chart to set top-level font size'
    },
    xAxis: {
        categories: ['Rain', 'Snow', 'Sun', 'Wind']
    },
    series: [{
        data: [324, 124, 547, 221],
        type: 'column',
        colorByPoint: true,
        dataLabels: {
            enabled: true,
            inside: true
        }
    }, {
        data: [698, 675, 453, 543]
    }]
});

document.getElementById('rem').addEventListener('input', e =>  {
    Object.keys(chart.renderer.cache).forEach(key => {
        delete chart.renderer.cache[key];
    });
    const fontSize = `${Number(e.target.value).toFixed(2)}rem`;
    chart.update({
        title: {
            text: `Root font size: ${fontSize}`
        },
        chart: {
            style: {
                fontSize
            }
        }
    });
});