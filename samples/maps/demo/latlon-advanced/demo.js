const H = Highcharts,
    map = H.maps['countries/us/us-all'];

let chart;

// Add series with state capital bubbles
Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-capitals.json', function (json) {

    const data = json.map(p => {
        p.z = p.population;
        return p;
    });

    chart = Highcharts.mapChart('container', {
        title: {
            text: 'Highcharts Maps lat/lon demo'
        },

        tooltip: {
            pointFormat: '{point.capital}, {point.parentState}<br>' +
                'Lat: {point.lat}<br>' +
                'Lon: {point.lon}<br>' +
                'Population: {point.population}'
        },

        xAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        yAxis: {
            crosshair: {
                zIndex: 5,
                dashStyle: 'dot',
                snap: false,
                color: 'gray'
            }
        },

        series: [{
            name: 'Basemap',
            mapData: map,
            borderColor: '#606060',
            nullColor: 'rgba(200, 200, 200, 0.2)',
            showInLegend: false
        }, {
            name: 'Separators',
            type: 'mapline',
            data: H.geojson(map, 'mapline'),
            color: '#101010',
            enableMouseTracking: false,
            showInLegend: false
        }, {
            type: 'mapbubble',
            dataLabels: {
                enabled: true,
                format: '{point.capital}'
            },
            name: 'Cities',
            data: data,
            maxSize: '12%',
            color: H.getOptions().colors[0]
        }]
    });
});

// Display custom label with lat/lon next to crosshairs
document.getElementById('container').addEventListener('mousemove', function (e) {
    if (chart) {
        if (!chart.lbl) {
            chart.lbl = chart.renderer.text('', 0, 0)
                .attr({
                    zIndex: 5
                })
                .css({
                    color: '#505050'
                })
                .add();
        }

        e = chart.pointer.normalize(e);

        // @todo Legacy code, remove after launch of v10
        if (!e.lon && !e.lat) {
            const projectedPosition = chart.mapView.pixelsToProjectedUnits({
                x: Math.round(e.chartX - chart.plotLeft),
                y: Math.round(e.chartY - chart.plotTop)
            });
            const position = chart.fromPointToLatLon(projectedPosition);
            e.lon = position.lon;
            e.lat = position.lat;
        }

        chart.lbl.attr({
            x: e.chartX + 5,
            y: e.chartY - 22,
            text: 'Lat: ' + e.lat.toFixed(2) + '<br>Lon: ' + e.lon.toFixed(2)
        });
    }
});

document.getElementById('container').addEventListener('mouseout', function () {
    if (chart && chart.lbl) {
        chart.lbl = chart.lbl.destroy();
    }
});
