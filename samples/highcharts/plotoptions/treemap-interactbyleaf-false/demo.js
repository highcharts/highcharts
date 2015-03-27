$(function () {
    $('#container').highcharts({
        series: [{
            type: "treemap",
            layoutAlgorithm: 'squarified',
            interactByLeaf: false,
            data: [{
                id: "id_1",
                name: 'A'
            }, {
                id: "id_2",
                name: 'A1',
                value: 2,
                parent: 'id_1'
            }, {
                id: "id_3",
                name: 'A2',
                value: 2,
                parent: 'id_1'
            }, {
                id: "id_4",
                name: 'A3',
                value: 2,
                parent: 'id_1'
            }, {
                name: 'B',
                value: 6
            }, {
                name: 'C',
                value: 4
            }, {
                name: 'D',
                value: 3
            }, {
                name: 'E',
                value: 2
            }, {
                name: 'F',
                value: 2
            }, {
                name: 'G',
                value: 1
            }]
        }],
        title: {
            text: 'Highcharts Treemap'
        }
    });
});