const pointStart = Date.UTC(2024, 0, 1),
    pointInterval = 36e5;
function getData(n) {
    const arr = [];

    for (let i = 0; i < n; i = i + 1) {
        arr.push([
            pointStart + pointInterval * i,
            2 * Math.sin(i / 100) + Math.random()
        ]);
    }
    return arr;
}

function getSeries(n, s) {
    const r = [];

    for (let i = 0; i < s; i++) {
        r.push({
            data: getData(n),
            dataGrouping: {
                enabled: false
            },
            animation: false,
            lineWidth: 2,
            boostThreshold: 1,
            showInNavigator: true,
            requireSorting: false,
            pointStart,
            pointInterval
        });
    }

    return r;
}

let n = 20;

const s = 600,
    series = getSeries(n, s);

console.time('line');
const chart = Highcharts.stockChart('container', {

    chart: {
        animation: false,
        zooming: {
            type: 'x'
        }
    },

    lang: {
        timezone: undefined
    },

    title: {
        text:
            'Highcharts drawing ' + (n * s) + ' points across ' + s + ' series'
    },

    navigator: {
        xAxis: {
            ordinal: false// ,
            // min: n / 2
            // max: 10
        },
        yAxis: {
            // min: 0,
            // max: 10
        },
        series: {
            color: null
        }
    },

    legend: {
        enabled: false
    },

    xAxis: {
        // min: n / 2,
        // max: 120,
        ordinal: false
    },

    yAxis: {
        // min: 0,
        // max: 8
    },

    subtitle: {
        text: 'Using the Boost module'
    },

    tooltip: {
        valueDecimals: 2,
        shared: false
    },

    series: series

});
console.timeEnd('line');

function addPoint() {
    ++n;

    chart.series.forEach(function dynAddPoint(se) {
        const x = pointStart + pointInterval * n,
            y = 2 * Math.sin(n / 100) + Math.random();

        // Yeah...
        if (se.options.className === 'highcharts-navigator-series') {
            return;
        }

        se.addPoint([x, y], false, true, false);
        // se.options.data.push([x, y]);
        // se.options.data.shift();
        // se.isDirty = true;
        // se.isDirtyData = true;
    });

    chart.redraw();
}

setInterval(addPoint, 1000);
// console.log(chart);

document.getElementById('profile-add').onclick = function () {
    console.profile('addPoint');
    addPoint();
    console.profileEnd();
};