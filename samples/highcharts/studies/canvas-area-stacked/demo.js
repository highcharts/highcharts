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
    var data1 = getData(50000),
        data2 = getData(50000);

    console.time('area');
    $('#container').highcharts({

        chart: {
            type: 'area',
            zoomType: 'x'
        },

        title: {
            text: 'Trimmed Highcharts drawing ' + (data1.length + data2.length) + ' points'
        },

        subtitle: {
            text: 'Using the experimental Highcharts Boost module'
        },

        tooltip: {
            valueDecimals: 2
        },

        plotOptions: {
            area: {
                stacking: true
            }
        },

        series: [{
            data: data1
        }, {
            data: data2
        }]

    });
    console.timeEnd('area');

});