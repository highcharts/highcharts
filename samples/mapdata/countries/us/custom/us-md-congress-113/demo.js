$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-md-01",
            "value": 0
        },
        {
            "hc-key": "us-md-05",
            "value": 1
        },
        {
            "hc-key": "us-md-02",
            "value": 2
        },
        {
            "hc-key": "us-md-06",
            "value": 3
        },
        {
            "hc-key": "us-md-03",
            "value": 4
        },
        {
            "hc-key": "us-md-07",
            "value": 5
        },
        {
            "hc-key": "us-md-04",
            "value": 6
        },
        {
            "hc-key": "us-md-08",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-md-congress-113.js">Maryland congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-md-congress-113'],
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
