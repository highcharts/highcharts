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
            }]
        }]
    });

    $('#addCircle').click(function () {
        var pos = chart.fromLatLonToPoint({ lat: 51.507222, lon: -0.1275 });
        chart.renderer.circle(chart.xAxis[0].toPixels(pos.x), chart.yAxis[0].toPixels(pos.y), 28).attr({
            zIndex: 100,
            fill: '#FCFFC5',
            'fill-opacity': 0.4,
            stroke: '#606060',
            'stroke-width': 1
        }).add();
    });
});
