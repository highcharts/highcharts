$(function () {
    // Instanciate the map
    $('#container').highcharts('Map', {
        chart : {
            borderWidth : 1
        },

        title : {
            text : 'Nordic countries'
        },
        subtitle : {
            text : 'Demo of drawing all areas in the map, only highlighting partial data'
        },

        legend: {
            enabled: false
        },

        series : [{
            name: 'Country',
            mapData: Highcharts.maps['custom/europe'],
            data: [{
                code: 'IS',
                value: 1
            }, {
                code: 'NO',
                value: 1
            }, {
                code: 'SE',
                value: 1
            }, {
                code: 'FI',
                value: 1
            }, {
                code: 'DK',
                value: 1
            }],
            joinBy: ['iso-a2', 'code'],
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                formatter: function () {
                    if (this.point.value) {
                        return this.point.name;
                    }
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '{point.name}'
            }
        }]
    });
});