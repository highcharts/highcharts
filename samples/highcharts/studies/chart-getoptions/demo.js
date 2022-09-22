const factory = 'chart';
const chart = Highcharts[factory]('container', {
    series: [{
        data: [1, 4, 3, 5],
        type: 'column',
        colorByPoint: true
    }]
});

/* eslint-disable-next-line no-underscore-dangle */
const diffObjects = Highcharts._modules[
    'Core/Utilities.js'
].diffObjects;

const getOptions = chart => diffObjects(
    chart.userOptions,
    Highcharts.defaultOptions
);


const o = getOptions(chart);
Highcharts[factory]('container-out', o);
console.log(o);
