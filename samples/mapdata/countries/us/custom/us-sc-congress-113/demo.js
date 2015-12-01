$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-sc-01",
            "value": 0
        },
        {
            "hc-key": "us-sc-02",
            "value": 1
        },
        {
            "hc-key": "us-sc-04",
            "value": 2
        },
        {
            "hc-key": "us-sc-03",
            "value": 3
        },
        {
            "hc-key": "us-sc-05",
            "value": 4
        },
        {
            "hc-key": "us-sc-07",
            "value": 5
        },
        {
            "hc-key": "us-sc-06",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-sc-congress-113.js">South Carolina congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-sc-congress-113'],
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
