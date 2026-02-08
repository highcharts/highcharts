(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/contour-mountain-data.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        chart: {
            height: 500,
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'Mountain elevation'
        },
        xAxis: {
            title: {
                text: 'longitude'
            },
            endOnTick: false,
            gridLineColor: '#fff4',
            gridLineWidth: 1,
            gridZIndex: 4,
            lineWidth: 1,
            maxPadding: 0,
            minPadding: 0,
            startOnTick: false,
            tickInterval: 0.01,
            tickWidth: 1
        },
        yAxis: {
            title: {
                text: 'latitude'
            },
            endOnTick: false,
            gridLineColor: '#fff4',
            gridLineWidth: 1,
            gridZIndex: 4,
            lineWidth: 1,
            maxPadding: 0,
            minPadding: 0,
            startOnTick: false,
            tickInterval: 0.01,
            tickWidth: 1
        },
        colorAxis: {
            stops: [
                [
                    0,
                    '#3060cf'
                ],
                [
                    0.5,
                    '#fffbbc'
                ],
                [
                    0.9,
                    '#c4463a'
                ]
            ]
        },
        series: [{
            clip: true,
            contourInterval: 50,
            contourOffset: 0,
            data: data,
            lineWidth: 1,
            marker: {
                states: {
                    hover: {
                        lineColor: 'white',
                        lineWidth: 2
                    }
                }
            },
            name: 'Elevation',
            smoothColoring: false,
            states: {
                hover: {
                    opacity: 1
                }
            },
            type: 'contour'
        }, {
            colorAxis: false,
            data: [
                [
                    22.7688,
                    49.072,
                    1333,
                    'Halicz'
                ],
                [
                    22.7702,
                    49.062,
                    1280,
                    'Rozsypaniec'
                ]
            ],
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            keys: ['x', 'y', 'value', 'name'],
            marker: {
                fillColor: '#000',
                symbol: 'triangle'
            },
            name: 'Peaks',
            showInLegend: false,
            type: 'scatter'
        }],
        tooltip: {
            pointFormat: '\n                lat: ' +
                   '<strong>{point.x:.2f}</strong>,<br/>\n ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   'lon: ' +
                   '<strong>{point.y:.2f}</strong>,<br/>\n ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   'elevation: ' +
                   '<strong>{point.value} ' +
                   'm</strong>\n ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ' ' +
                   ''
        }
    });

})();
