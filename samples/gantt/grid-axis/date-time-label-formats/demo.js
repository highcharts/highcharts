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
            start: Date.UTC(2014, 2, 18),
            end: Date.UTC(2014, 3, 1)
        }, {
            name: 'Test prototype',
            start: Date.UTC(2014, 3, 1),
            end: Date.UTC(2014, 3, 13)
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