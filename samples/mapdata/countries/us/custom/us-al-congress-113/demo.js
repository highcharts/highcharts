$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-al-01",
            "value": 0
        },
        {
            "hc-key": "us-al-04",
            "value": 1
        },
        {
            "hc-key": "us-al-05",
            "value": 2
        },
        {
            "hc-key": "us-al-07",
            "value": 3
        },
        {
            "hc-key": "us-al-06",
            "value": 4
        },
        {
            "hc-key": "us-al-02",
            "value": 5
        },
        {
            "hc-key": "us-al-03",
            "value": 6
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-al-congress-113.js">Alabama congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-al-congress-113'],
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
