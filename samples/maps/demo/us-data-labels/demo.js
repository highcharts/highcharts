// Load the data from the HTML table and tag it with an upper case name used for joining
var data = [],
    // Get the map data
    mapData = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small']);

Highcharts.data({
    table: document.getElementById('data'),
    startColumn: 1,
    firstRowAsNames: false,
    complete: function (options) {
        options.series[0].data.forEach(function (p) {
            data.push({
                ucName: p[0],
                value: p[1]
            });
        });
    }
});

// Process mapdata
mapData.forEach(function (p) {
    const { coordinates } = p;

    // This point has a square legend to the right
    // @todo: Add hs-middle-x and hs-middle-y to the geojson map data instead of
    // this hack
    const legendBox = coordinates[0][0];
    if (legendBox[0][0] === 9727) {

        // Identify the box
        const bounds = Highcharts.seriesTypes.map.prototype
            .getProjectedBounds
            .call({
                chart: {
                    mapView: {
                        projection: new Highcharts._modules[// eslint-disable-line no-underscore-dangle
                            'Maps/Projection.js'
                        ]()
                    }
                },
                points: [p]
            });

        // Place the center of the data label in the center of the point legend
        // box
        p.middleX = ((legendBox[0][0] + legendBox[1][0]) / 2 - bounds.x1) /
            (bounds.x2 - bounds.x1);
        p.middleY = ((legendBox[0][1] + legendBox[2][1]) / 2 - bounds.y2) /
            (bounds.y1 - bounds.y2);

        delete p.bounds;
    }

    // Tag it for joining
    p.ucName = p.name.toUpperCase();
});

// Initiate the chart
Highcharts.mapChart('container', {

    title: {
        text: 'US unemployment rate in Dec. 2017'
    },

    subtitle: {
        text: 'Small US map with data labels'
    },

    mapNavigation: {
        enabled: true,
        enableButtons: false
    },

    xAxis: {
        labels: {
            enabled: false
        }
    },

    colorAxis: {
        labels: {
            format: '{value}%'
        }
    },

    series: [{
        mapData: mapData,
        data: data,
        joinBy: 'ucName',
        name: 'Unemployment rate per 2015',
        states: {
            hover: {
                color: '#a4edba'
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function () {
                return this.point.properties['hc-a2'];
            },
            style: {
                fontSize: '10px'
            }
        },
        tooltip: {
            valueSuffix: '%'
        }
    }, {
        type: 'mapline',
        data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small'], 'mapline'),
        color: 'silver'
    }]
});
