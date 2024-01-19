const lineData = [
    13, 8, 4, 10, 5, 7, 1, 8, 6, 4, 0, 3, 10, 11, 9, 12, 4, 9, 11, 2, 17, 8,
    14, 18, 21, 21, 22, 20, 19, 15, 12, 22, 20, 11, 11, 24, 21, 26, 11, 21, 14,
    18, 14, 17, 20, 20, 18, 16, 10, 12, 3, 9, 1, 5, 1, 1, 14, 8, 1, 3, 9, 5, 24,
    11, 11, 13, 17, 13, 29, 12, 15, 13, 27, 27, 15, 26, 20, 28, 10, 10, 21, 9,
    6, 19, 11, 20, 18, 7, 11, 1, 9, 5, 6, 4, 3, 0
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
        type: 'datetime',
        min: Date.UTC(2024, 0, 1),
        max: Date.UTC(2024, 0, 4)
    }
});