$(function () {

    function getData(n) {
        var arr = [],
            i,
            a,
            b,
            c,
            low,
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
    var data = getData(500000);

    console.time('column');
    $('#container').highcharts({

        chart: {
            type: 'column',
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + data.length + ' points'
        },

        subtitle: {
            text: 'Using the experimental Highcharts Boost module'
        },

        tooltip: {
            valueDecimals: 2
        },

        series: [{
            data: data
        }]

    });
    console.timeEnd('column');

});