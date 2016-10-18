$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nc-03",
            "value": 0
        },
        {
            "hc-key": "us-nc-07",
            "value": 1
        },
        {
            "hc-key": "us-nc-08",
            "value": 2
        },
        {
            "hc-key": "us-nc-09",
            "value": 3
        },
        {
            "hc-key": "us-nc-01",
            "value": 4
        },
        {
            "hc-key": "us-nc-13",
            "value": 5
        },
        {
            "hc-key": "us-nc-06",
            "value": 6
        },
        {
            "hc-key": "us-nc-10",
            "value": 7
        },
        {
            "hc-key": "us-nc-05",
            "value": 8
        },
        {
            "hc-key": "us-nc-11",
            "value": 9
        },
        {
            "hc-key": "us-nc-02",
            "value": 10
        },
        {
            "hc-key": "us-nc-12",
            "value": 11
        },
        {
            "hc-key": "us-nc-04",
            "value": 12
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-nc-congress-113.js">North Carolina congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-nc-congress-113'],
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
