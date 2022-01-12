// Load the data from the HTML table and tag it with an upper case name used for joining
const data = [],
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

// Prepare mapData for joining
mapData.forEach(function (p) {
    p.ucName = p.name.toUpperCase();
});

// Initialize the chart
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
