const lineData = [
    0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 7,
    8, 8, 8, 9, 9, 9, 8, 8, 7, 7, 6, 5,
    4, 2, 1, 0, 1, 2, 3, 3, 3, 3, 3, 2,
    2, 1, 0, 0, 1, 2, 3, 4, 4, 5, 6, 7,
    7, 7, 7, 7, 7, 6, 6, 5, 3, 2, 0, 1
];
const columnData = [];
let date = 0;

lineData.forEach((d, i) => {
    if (i % 23 === 0) {
        columnData.push([Date.UTC(2024, 0, date++), d]);
    }
});

Highcharts.chart('container', {
    series: [{
        type: 'column',
        data: columnData,
        pointRange: 24 * 36e5,
        pointPlacement: 'between',
        min: 0
    }, {
        data: lineData,
        pointStart: Date.UTC(2024, 0, 1),
        pointInterval: 36e5
    }],

    xAxis: {
        type: 'datetime'
    }
});