const chart = Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        showEmpty: false
    },
    yAxis: {
        showEmpty: false
    },
    series: [{
        allowPointSelect: true,
        data: [ // use names for display in pie data labels
            ['January',    29.9],
            ['February',   71.5],
            ['March',     106.4],
            ['April',     129.2],
            ['May',       144.0],
            ['June',      176.0],
            ['July',      135.6],
            ['August',    148.5],
            {
                name: 'September',
                y: 216.4,
                selected: true,
                sliced: true
            },
            ['October',   194.1],
            ['November',   95.6],
            ['December',   54.4]
        ],
        marker: {
            enabled: false
        },
        showInLegend: true
    }]
});

chart.name = false;

let enableDataLabels = true,
    enableMarkers = true,
    color = false;

document.getElementById('name').addEventListener('click', () => {
    chart.series[0].update({
        name: chart.name ? null : 'First'
    });
    chart.name = !chart.name;
});

document.getElementById('data-labels').addEventListener('click', () => {
    chart.series[0].update({
        dataLabels: {
            enabled: enableDataLabels
        }
    });
    enableDataLabels = !enableDataLabels;
});

document.getElementById('markers').addEventListener('click', () => {
    chart.series[0].update({
        marker: {
            enabled: enableMarkers
        }
    });
    enableMarkers = !enableMarkers;
});

document.getElementById('color').addEventListener('click', () => {
    chart.series[0].update({
        color: color ? null : Highcharts.getOptions().colors[1]
    });
    color = !color;
});

['line', 'column', 'spline', 'area', 'areaspline', 'scatter', 'pie'].forEach(type =>
    document.getElementById(type).addEventListener('click', () => {
        chart.series[0].update({
            type: type
        });
    })
);
