const chart = Highcharts.ganttChart('container', {
    xAxis: [{
        dateTimeLabelFormats: {
            week: {
                list: ['Uke %W', 'U%W']
            }
        }
    }],
    series: [{
        data: [{
            name: 'Start prototype',
            start: '2014-03-18',
            end: '2014-04-01'
        }, {
            name: 'Test prototype',
            start: '2014-04-01',
            end: '2014-04-13'
        }]
    }]
});

document.getElementById('update').addEventListener('click', function () {
    chart.update({
        chart: {
            width: 300
        }
    });
});