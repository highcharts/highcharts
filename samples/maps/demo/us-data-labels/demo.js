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
    var path = p.path,
        copy = {
            path: path
        };

    // This point has a square legend to the right
    if (path[0][1] === 9727) {

        // Identify the box
        Highcharts.seriesTypes.map.prototype.getBox.call({}, [copy]);

        // Place the center of the data label in the center of the point legend box
        p.middleX = ((path[0][1] + path[1][1]) / 2 - copy._minX) / (copy._maxX - copy._minX); // eslint-disable-line no-underscore-dangle
        p.middleY = ((path[0][2] + path[2][2]) / 2 - copy._minY) / (copy._maxY - copy._minY); // eslint-disable-line no-underscore-dangle

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
