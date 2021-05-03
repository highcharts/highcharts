import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';

MapModule(Highcharts);

test_simple();
test_series();

function test_simple() {
    Highcharts.mapChart('container', {
        series: [{
          	type: 'map',
            data: [{
                value: 100,
                name: 'a'
            }, {
                value: 150,
                name: 'b'
            }],
            joinBy: 'id',
            mapData: [{
                path: ['M', 0, 0, 'L', 10, 0, 10, 10, 0, 10, 'Z'],
                name: 'a'
            }, {
                path: ['M', 20, 20, 'L', 30, 20, 15, 15, 20, 30, 'Z'],
                name: 'b'
            }]
        }]
    });
}

function test_series() {
    const defaultOptions = Highcharts.getOptions();
    const tooltipFormatter = function(
        this: Highcharts.TooltipFormatterContextObject
    ) {
        const point = this.point as any; // @todo make id, lat, lon public
        return point.id + (
            point.lat ? `<br>Lat:${point.lat} Lon: ${point.lon}` : ''
        );
    };
    Highcharts.mapChart('container', {
        title: {
            text: 'Highmaps simple flight routes demo'
        },
        legend: {
            align: 'left',
            layout: 'vertical',
            floating: true
        },
        mapNavigation: {
            enabled: true
        },
        tooltip: {
            formatter: tooltipFormatter
        },
        plotOptions: {
            series: {
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: (defaultOptions.colors && defaultOptions.colors[1])
                }
            }
        },
        series: [{
            // Use the gb-all map with no data as a basemap
            type: 'map',
            mapData: Highcharts.maps['countries/gb/gb-all'],
            name: 'Basemap',
            borderColor: '#707070',
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
            // Specify cities using lat/lon
            type: 'mappoint',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            // Use id instead of name to allow for referencing points later using
            // chart.get
            data: [{
                id: 'London',
                lat: 51.507222,
                lon: -0.1275
            }, {
                id: 'Birmingham',
                lat: 52.483056,
                lon: -1.893611
            }, {
                id: 'Leeds',
                lat: 53.799722,
                lon: -1.549167
            }, {
                id: 'Glasgow',
                lat: 55.858,
                lon: -4.259
            }, {
                id: 'Sheffield',
                lat: 53.383611,
                lon: -1.466944
            }, {
                id: 'Liverpool',
                lat: 53.4,
                lon: -3
            }, {
                id: 'Bristol',
                lat: 51.45,
                lon: -2.583333
            }, {
                id: 'Belfast',
                lat: 54.597,
                lon: -5.93
            }, {
                id: 'Lerwick',
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
}
