$(function () {
    // Instanciate the map
    Highcharts.mapChart('container', {
        chart: {
            borderWidth: 1
        },

        title: {
            text: 'Nordic countries'
        },
        subtitle: {
            text: 'Demo of drawing all areas in the map, only highlighting partial data'
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Country',
            mapData: Highcharts.maps['custom/europe'],
            data: [
                ['is', 1],
                ['no', 1],
                ['se', 1],
                ['dk', 1],
                ['fi', 1]
            ],
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