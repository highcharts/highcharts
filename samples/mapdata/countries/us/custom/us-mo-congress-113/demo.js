$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-mo-01",
            "value": 0
        },
        {
            "hc-key": "us-mo-03",
            "value": 1
        },
        {
            "hc-key": "us-mo-02",
            "value": 2
        },
        {
            "hc-key": "us-mo-08",
            "value": 3
        },
        {
            "hc-key": "us-mo-04",
            "value": 4
        },
        {
            "hc-key": "us-mo-05",
            "value": 5
        },
        {
            "hc-key": "us-mo-07",
            "value": 6
        },
        {
            "hc-key": "us-mo-06",
            "value": 7
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-mo-congress-113.js">Missouri congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-mo-congress-113'],
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
