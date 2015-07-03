$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ks-02",
            "value": 0
        },
        {
            "hc-key": "us-ks-01",
            "value": 1
        },
        {
            "hc-key": "us-ks-04",
            "value": 2
        },
        {
            "hc-key": "us-ks-03",
            "value": 3
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ks-congress-113.js">Kansas congressional districts</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/us/custom/us-ks-congress-113'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
