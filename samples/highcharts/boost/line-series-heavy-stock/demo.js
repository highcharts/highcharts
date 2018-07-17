
var n = 120,
    s = 600,
    pointStart = Date.UTC(2017, 0, 1),
    pointInterval = 24 * 36e5;

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
            spike = 0;
        } else {
            spike = 0;
        }
        arr.push([
            pointStart + i * pointInterval,
            2 * Math.sin(i / 100) + a + b + c + spike + Math.random()
        ]);
    }
    return arr;
}

function getSeries(n, s) {
    var i = 0,
        r = [];

    for (; i < s; i++) {
        r.push({
            data: getData(n),
            lineWidth: 2,
            boostThreshold: 1,
            turboThreshold: 1,
            showInNavigator: true
        });
    }

    return r;
}

var series = getSeries(n, s);


console.time('line');
Highcharts.stockChart('container', {

    chart: {
        zoomType: 'x'
    },

    title: {
        text: 'Highcharts drawing ' + (n * s) + ' points across ' + s + ' series'
    },

    navigator: {
        xAxis: {
            ordinal: false,
            min: pointStart,
            max: pointStart + n * pointInterval
        },
        yAxis: {
            min: 0,
            max: 10
        },
        series: {
            color: null // Inherit from base
        }
    },

    scrollbar: {
        liveRedraw: false
    },

    legend: {
        enabled: false
    },

    xAxis: {
        min: pointStart,
        max: pointStart + n * pointInterval,
        ordinal: false
    },

    yAxis: {
        min: 0,
        max: 8
    },

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2,
        split: false
    },

    series: series

});
console.timeEnd('line');
