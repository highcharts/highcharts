$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ct-05",
            "value": 0
        },
        {
            "hc-key": "us-ct-03",
            "value": 1
        },
        {
            "hc-key": "us-ct-04",
            "value": 2
        },
        {
            "hc-key": "us-ct-02",
            "value": 3
        },
        {
            "hc-key": "us-ct-01",
            "value": 4
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-ct-congress-113.js">Connecticut congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-ct-congress-113'],
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
