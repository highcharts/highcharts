

function getData(n) {
    var arr = [],
        i;
    for (i = 0; i < n; i++) {
        arr.push(Math.sin(Math.PI * 2 / 360 * i));
    }
    return arr;
}


var chart = Highcharts.chart('container', {

    title: {
        text: 'Dense column borders'
    },

    series: [{
        type: 'column',
        name: 'Sinus',
        data: getData(360)
    }]
});

$('#dense').click(function () {
    chart.series[0].setData(getData(360));
});

$('#sparse').click(function () {
    chart.series[0].setData(getData(45));
});