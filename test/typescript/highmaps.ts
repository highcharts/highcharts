import * as Highmaps from 'highcharts/highmaps';

function test_simple() {
    Highmaps.mapChart('container', {
        series: [{
          	type: 'map',
            data: [{
                value: 100,
                id: 'a'
            }, {
                value: 150,
                id: 'b'
            }],
            joinBy: 'id',
            mapData: [{
                path: ['M', 0, 0, 'L', 10, 0, 10, 10, 0, 10, 'Z'],
                id: 'a'
            }, {
                path: ['M', 20, 20, 'L', 30, 20, 15, 15, 20, 30, 'Z'],
                id: 'b'
            }]
        }]
    });
}

function test_series() {
    const defaultOptions = Highmaps.getOptions();
    const tooltipFormatter = function (this: { point: { id: string, lat: number, lon: number } } ): string {
        return this.point.id + (
            this.point.lat ?
            `<br>Lat:${this.point.lat} Lon: ${this.point.lon}` : ''
        )
    };
    Highmaps.mapChart('container', {
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
            mapData: Highmaps.maps['countries/gb/gb-all'],
            name: 'Basemap',
            borderColor: '#707070',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highmaps.geojson(Highmaps.maps['countries/gb/gb-all'], 'mapline'),
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
