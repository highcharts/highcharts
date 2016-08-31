$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-la-01",
            "value": 0
        },
        {
            "hc-key": "us-la-03",
            "value": 1
        },
        {
            "hc-key": "us-la-05",
            "value": 2
        },
        {
            "hc-key": "us-la-02",
            "value": 3
        },
        {
            "hc-key": "us-la-06",
            "value": 4
        },
        {
            "hc-key": "us-la-04",
            "value": 5
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-la-congress-113.js">Louisiana congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-la-congress-113'],
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
