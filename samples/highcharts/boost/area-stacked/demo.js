function getDataTableOptions(n) {
    const xColumn = new Float64Array(n),
        y1Column = new Float64Array(n),
        y2Column = new Float64Array(n);
    let a,
        b,
        c,
        spike;
    for (let i = 0; i < n; i = i + 1) {
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
        xColumn[i] = i;
        y1Column[i] = 2 * Math.sin(i / 100) + a + b + c + spike + Math.random();
    }
    for (let i = 0; i < n; i = i + 1) {
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
        y2Column[i] = 2 * Math.sin(i / 100) + a + b + c + spike + Math.random();
    }
    return {
        columns: {
            x: xColumn,
            y1: y1Column,
            y2: y2Column
        }
    };
}
const dataTable = getDataTableOptions(25000);

console.time('area');
Highcharts.chart('container', {

    dataTable,

    chart: {
        type: 'area',
        zooming: {
            type: 'x'
        }
    },

    boost: {
        useGPUTranslations: true
    },

    title: {
        text: 'Highcharts drawing 50000 points'
    },

    subtitle: {
        text: 'Using the Boost module'
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
        dataMapping: {
            y: 'y1'
        }
    }, {
        dataMapping: {
            y: 'y2'
        }
    }]

});
console.timeEnd('area');
