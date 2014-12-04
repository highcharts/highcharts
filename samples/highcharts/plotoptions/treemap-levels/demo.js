$(function () {
    $('#container').highcharts({
        series: [{
            type: "treemap",
            layoutAlgorithm: 'squarified',
            levels: [{
                level: 1,
                borderWidth: '3px',
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    verticalAlign: 'top',
                    color: 'white',
                    style: {
                        fontWeight: 'bold'   
                    }
                }
            }, {
                level: 2,
                layoutAlgorithm: 'stripes'
            }],            
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