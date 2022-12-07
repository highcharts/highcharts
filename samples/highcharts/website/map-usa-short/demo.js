// Load the data from the HTML table and tag it with an upper case name used for joining
var data = [],
    // Get the map data
    mapData = Highcharts.geojson(Highcharts.maps['countries/us/custom/us-small']);

Highcharts.data({
    table: document.getElementById('data'),
    startColumn: 1,
    startRow: 0,
    complete: function (options) {
        $.each(options.series[0].data, function () {
            data.push({
                ucName: this[0],
                value: this[1]
            });
        });
    }
});

// Process mapdata
$.each(mapData, function () {
    this.ucName = this.name.toUpperCase();
});

// Initiate the chart
Highcharts.mapChart('container', {

    title: {
        text: null
    },

    subtitle: {
        text: null
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