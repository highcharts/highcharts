var el = function (id) {
    return document.getElementById(id);
};

var chart = Highcharts.chart('container', {
    series: [{
        data: [1, 4, 5, 2, 8, 12, 6, 4]
    }, {
        data: [2, 3, 5, 4, 2, 2]
    }]
});

el('chart').onclick = function () {
    chart.sonify();
};

el('series').onclick = function () {
    chart.series[0].sonify();
};

el('point').onclick = function () {
    chart.series[0].points[5].sonify();
};
