$(function () {

    // Load the data from the HTML table and tag it with an upper case name used for joining
    var data = [];
    Highcharts.data({
        table: document.getElementById('data'),
        startColumn: 1,
        startRow: 1,
        complete: function (options) {
            $.each(options.series[0].data, function () {
                data.push({
                    ucName: this[0],
                    value: this[1]
                });
            });
        }
    });

    var mapData = Highcharts.geojson(Highcharts.maps['countries/usa/custom/usa-small']);
    
    // Y positions for small eastern states' data labels
    var middleYs = {
        'US.VT': 0.4,
        'US.NH': 0.8,
        'US.MA': 0.8,
        'US.RI': 0.8,
        'US.CT': 0.8,
        'US.NJ': 0.8,
        'US.DE': 0.8,
        'US.MD': 0.8,
        'US.DC': 0.8
    };
    $.each(mapData, function (i, point) {
        if (middleYs.hasOwnProperty(point.properties['hc-key'])) {
            point.middleY = middleYs[point.properties['hc-key']];
            point.middleX = 1; // to the right
            /*point.dataLabels = {
                x: 3,
                align: 'left',
                color: 'black',
                style: {
                    HcTextStroke: 'none',
                    fontWeight: 'normal'
                }
            }*/
        }

        // Tag it for joining
        point.ucName = point.name.toUpperCase();
    });



    // Initiate the chart
    $('#container').highcharts('Map', {

        title: {
            text: 'US unemployment rate 2014'
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

        colorAxis: {},

        series: [{
            mapData : mapData,
            data: data,
            joinBy: 'ucName',
            name: 'Unemployment rate per 2014',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.point.properties['hc-key'].substr(3, 2);
                }
            },
            tooltip: {
                valueSuffix: '%'
            }
        }, {
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/usa/custom/usa-small'], 'mapline'),
            color: 'silver'
        }]
    });
});