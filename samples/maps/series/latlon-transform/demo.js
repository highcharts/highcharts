$(function () {

    // Initiate the chart
    var chart = Highcharts.Map({        
        chart: {
            renderTo: 'container'
        },

        title: {
            text: 'Highmaps lat/lon demo'
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
                name: 'Auto transformed point',
                lat: 58.78,
                lon: -1.26
            }]
        }]
    }),

    /** Add point relative to Shetland, outside Shetland zone in map. **/

    // Transform definition is grabbed from map, under the "hc-transform" object.
    // To get the mainland transform defintion, use the "default" definition instead of "gb-all-shetland".
    transform = Highcharts.maps['countries/gb/gb-all']['hc-transform']['gb-all-shetland'],
    position = chart.transformFromLatLon({ lat: 58.78, lon: -1.26 }, transform);
    chart.series[2].addPoint({
        name: 'Manually transformed point<br>(relative to Shetland)',
        x: position.x,
        y: position.y
    });

});
