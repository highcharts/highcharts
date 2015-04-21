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
    var n = 500000,
        data = getData(n);


    console.time('area');
    $('#container').highcharts({

        chart: {
            type: 'area',
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + n + ' points'
        },

        subtitle: {
            text: 'The arearange is rendered on canvas, and some features are bypassed for speed'
        },

        tooltip: {
            shared: true,
            headerFormat: '',
            pointFormat: 'x: {point.x}, y: {point.y:.2f}'
        },

        series: [{
            data: data
        }]

    });
    console.timeEnd('area');

});