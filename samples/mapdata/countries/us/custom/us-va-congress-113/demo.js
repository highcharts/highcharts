$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-va-02",
            "value": 0
        },
        {
            "hc-key": "us-va-11",
            "value": 1
        },
        {
            "hc-key": "us-va-10",
            "value": 2
        },
        {
            "hc-key": "us-va-08",
            "value": 3
        },
        {
            "hc-key": "us-va-03",
            "value": 4
        },
        {
            "hc-key": "us-va-04",
            "value": 5
        },
        {
            "hc-key": "us-va-07",
            "value": 6
        },
        {
            "hc-key": "us-va-01",
            "value": 7
        },
        {
            "hc-key": "us-va-05",
            "value": 8
        },
        {
            "hc-key": "us-va-06",
            "value": 9
        },
        {
            "hc-key": "us-va-09",
            "value": 10
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-va-congress-113.js">Virginia congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-va-congress-113'],
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
