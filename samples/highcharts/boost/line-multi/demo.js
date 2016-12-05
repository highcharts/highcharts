$(function () {

    function getData(n) {
        var arr = [],
            i,
            a,
            b,
            c,
            spike;
        for (i = 0; i < n; i = i + 1) {
            if (i % 100 === 0) {
                a = 2 * Math.random();
            }
            if (i % 1000 === 0) {
                b = 2 * Math.random();
            }
            if (i % 10000 === 0) {
                c = 2 * Math.random();
            }
            if (i % 50000 === 0) {
                spike = 10;
            } else {
                spike = 0;
            }
            arr.push([
                i,
                2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
            ]);
        }
        return arr;
    }

    function getSeries(seriesCount, pointCount) {
        var arr = [];
        for (var i = 0; i < seriesCount; i++) {
            arr.push({
                data: getData(pointCount)
            });
        }
        return arr;
    }
    var pointCount = 120,
        seriesCount = 600;


    console.time('line');
    Highcharts.chart('container', {

        chart: {
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + seriesCount + ' series, each ' + pointCount + ' points'
        },

        subtitle: {
            text: 'Using the experimental Highcharts Boost module'
        },

        legend: {
            enabled: false
        },

        tooltip: {
            valueDecimals: 2
        },

        plotOptions: {
            series: {
                boostThreshold: 1,
                turboThreshold: 1,
                lineWidth: 0.5
            }
        },

        series: getSeries(seriesCount, pointCount)

    });
    console.timeEnd('line');

});