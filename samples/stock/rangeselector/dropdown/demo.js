let chart;

Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/range.json', data => {
    chart = Highcharts.stockChart('container', {
        chart: {
            type: 'arearange'
        },
        rangeSelector: {
            selected: 2
        },
        title: {
            text: 'Temperature variation by day'
        },
        subtitle: {
            text: 'The dropdown option determines what<br>should happen when there is not enough space<br>to show the range selector in a single row'
        },
        tooltip: {
            valueSuffix: '°C'
        },
        series: [{
            name: 'Temperatures',
            data: data
        }]
    });
});

document.getElementById('dropdown').addEventListener('click', e => {
    const dropdown = e.target.dataset.dropdown;
    if (dropdown) {
        chart.update({
            rangeSelector: {
                dropdown
            }
        });
    }
});

document.getElementById('width').addEventListener('click', e => {
    const width = e.target.dataset.width;
    if (width) {
        document.getElementById('container').style.width = width;
        chart.reflow();
        chart.redraw();
    }
});