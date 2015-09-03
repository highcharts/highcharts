$(function () {

    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'Highmaps basic lat/lon demo'
        },

        mapNavigation: {
            enabled: true
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
        },

        series: [{
            // Use the gb-all map with no data as a basemap
            mapData: Highcharts.maps['countries/gb/gb-all'],
            name: 'Basemap',
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/gb/gb-all'], 'mapline'),
            color: '#707070',
            showInLegend: false,
            enableMouseTracking: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Cities',
            color: Highcharts.getOptions().colors[1],
            data: [{
                name: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                name: 'Birmingham',
                lat: 52.483056,
                lon: -1.893611
            }, {
                name: 'Leeds',
                lat: 53.799722,
                lon: -1.549167
            }, {
                name: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }, {
                name: 'Sheffield',
                lat: 53.383611,
                lon: -1.466944
            }, {
                name: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                name: 'Bristol',
                lat: 51.45,
                lon: -2.583333
            }, {
                name: 'Belfast',
                lat: 54.597,
                lon: -5.93
            }, {
                name: 'Lerwick',
                lat: 60.155,
                lon: -1.145,
                dataLabels: {
                    align: 'left',
                    x: 5,
                    verticalAlign: 'middle'
                }
            }]
        }]
    });
});
