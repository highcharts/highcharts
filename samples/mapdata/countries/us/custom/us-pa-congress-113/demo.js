$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-pa-18",
            "value": 0
        },
        {
            "hc-key": "us-pa-01",
            "value": 1
        },
        {
            "hc-key": "us-pa-13",
            "value": 2
        },
        {
            "hc-key": "us-pa-08",
            "value": 3
        },
        {
            "hc-key": "us-pa-07",
            "value": 4
        },
        {
            "hc-key": "us-pa-02",
            "value": 5
        },
        {
            "hc-key": "us-pa-03",
            "value": 6
        },
        {
            "hc-key": "us-pa-05",
            "value": 7
        },
        {
            "hc-key": "us-pa-10",
            "value": 8
        },
        {
            "hc-key": "us-pa-04",
            "value": 9
        },
        {
            "hc-key": "us-pa-17",
            "value": 10
        },
        {
            "hc-key": "us-pa-06",
            "value": 11
        },
        {
            "hc-key": "us-pa-14",
            "value": 12
        },
        {
            "hc-key": "us-pa-16",
            "value": 13
        },
        {
            "hc-key": "us-pa-11",
            "value": 14
        },
        {
            "hc-key": "us-pa-09",
            "value": 15
        },
        {
            "hc-key": "us-pa-15",
            "value": 16
        },
        {
            "hc-key": "us-pa-12",
            "value": 17
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-pa-congress-113.js">Pennsylvania congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-pa-congress-113'],
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
