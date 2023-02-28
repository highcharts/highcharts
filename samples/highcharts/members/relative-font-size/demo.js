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

const fontSizes = [
    '50%',
    '75%',
    '85%',
    '100%',
    '115%',
    '125%',
    '150%',
    '175%',
    '200%',
    '250%',
    '300%'
];
let fontSizeIndex = 3;
document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () =>  {
        const font100 = document.getElementById('font-100');
        if (btn.id === 'font-smaller') {
            fontSizeIndex--;
        } else if (btn.id === 'font-larger') {
            fontSizeIndex++;
        } else {
            fontSizeIndex = 3;
        }

        fontSizeIndex = Math.min(
            fontSizes.length - 1, Math.max(0, fontSizeIndex)
        );
        const fontSize = fontSizes[fontSizeIndex];
        font100.innerText = fontSize;
        font100.disabled = fontSizeIndex === 3;

        chart.update({
            chart: {
                style: {
                    fontSize
                }
            }
        });
    });
});