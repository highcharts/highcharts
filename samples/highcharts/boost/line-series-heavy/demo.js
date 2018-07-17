
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
            i,
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
            turboThreshold: 1
        });
    }

    return r;
}

var n = 1000,
    s = 600,
    series = getSeries(n, s);


console.time('line');
Highcharts.chart('container', {

    chart: {
        zoomType: 'x'
    },

    title: {
        text: 'Highcharts drawing ' + (n * s) + ' points across ' + s + ' series'
    },

    legend: {
        enabled: false
    },

    boost: {
        useGPUTranslations: true
    },

    xAxis: {
        min: 0,
        max: 120,
        ordinal: false
    },

    navigator: {
        xAxis: {
            ordinal: false,
            min: 0,
            max: 10
        }
    },

    // yAxis: {
    //     min: 0,
    //     max: 8
    // },

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2
    },

    series: series

});
console.timeEnd('line');
