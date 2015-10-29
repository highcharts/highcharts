$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-nj-02",
            "value": 0
        },
        {
            "hc-key": "us-nj-07",
            "value": 1
        },
        {
            "hc-key": "us-nj-01",
            "value": 2
        },
        {
            "hc-key": "us-nj-09",
            "value": 3
        },
        {
            "hc-key": "us-nj-06",
            "value": 4
        },
        {
            "hc-key": "us-nj-10",
            "value": 5
        },
        {
            "hc-key": "us-nj-12",
            "value": 6
        },
        {
            "hc-key": "us-nj-03",
            "value": 7
        },
        {
            "hc-key": "us-nj-11",
            "value": 8
        },
        {
            "hc-key": "us-nj-04",
            "value": 9
        },
        {
            "hc-key": "us-nj-05",
            "value": 10
        },
        {
            "hc-key": "us-nj-08",
            "value": 11
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-nj-congress-113.js">New Jersey congressional districts</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-nj-congress-113'],
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
