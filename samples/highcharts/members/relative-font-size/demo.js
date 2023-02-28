const chart = Highcharts.chart('container', {
    title: {
        align: 'left',
        text: 'Variable font size'
    },
    subtitle: {
        align: 'left',
        text: 'Use the buttons above the chart to set top-level font size'
    },
    xAxis: {
        categories: ['Rain', 'Snow', 'Sun', 'Wind']
    },
    yAxis: {
        title: {
            text: 'Hours'
        }
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

let fontSizeNum = 1;
document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () =>  {
        if (btn.id === 'font-smaller') {
            fontSizeNum -= 0.2;
        } else {
            fontSizeNum += 0.2;
        }
        fontSizeNum = Math.min(2.4, Math.max(0.4, fontSizeNum));
        const fontSize = fontSizeNum.toFixed(1) + 'rem';
        document.getElementById('font-current').innerText = fontSize;
        chart.update({
            chart: {
                style: {
                    fontSize
                }
            }
        });
    });
});