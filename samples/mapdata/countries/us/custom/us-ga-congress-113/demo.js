$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ga-01",
            "value": 0
        },
        {
            "hc-key": "us-ga-11",
            "value": 1
        },
        {
            "hc-key": "us-ga-04",
            "value": 2
        },
        {
            "hc-key": "us-ga-05",
            "value": 3
        },
        {
            "hc-key": "us-ga-12",
            "value": 4
        },
        {
            "hc-key": "us-ga-13",
            "value": 5
        },
        {
            "hc-key": "us-ga-10",
            "value": 6
        },
        {
            "hc-key": "us-ga-03",
            "value": 7
        },
        {
            "hc-key": "us-ga-09",
            "value": 8
        },
        {
            "hc-key": "us-ga-02",
            "value": 9
        },
        {
            "hc-key": "us-ga-07",
            "value": 10
        },
        {
            "hc-key": "us-ga-06",
            "value": 11
        },
        {
            "hc-key": "us-ga-08",
            "value": 12
        },
        {
            "hc-key": "us-ga-14",
            "value": 13
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/us/custom/us-ga-congress-113.js">Georgia congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-ga-congress-113'],
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
