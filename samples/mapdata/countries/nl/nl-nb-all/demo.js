$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-3558-gm1655",
            "value": 0
        },
        {
            "hc-key": "nl-3558-gm1685",
            "value": 1
        },
        {
            "hc-key": "nl-3558-gm0815",
            "value": 2
        },
        {
            "hc-key": "nl-3558-gm0879",
            "value": 3
        },
        {
            "hc-key": "nl-3558-gm0840",
            "value": 4
        },
        {
            "hc-key": "nl-3558-gm0744",
            "value": 5
        },
        {
            "hc-key": "nl-3558-gm1723",
            "value": 6
        },
        {
            "hc-key": "nl-3558-gm0851",
            "value": 7
        },
        {
            "hc-key": "nl-3558-gm1674",
            "value": 8
        },
        {
            "hc-key": "nl-3558-gm0748",
            "value": 9
        },
        {
            "hc-key": "nl-3558-gm1658",
            "value": 10
        },
        {
            "hc-key": "nl-3558-gm1719",
            "value": 11
        },
        {
            "hc-key": "nl-3558-gm1709",
            "value": 12
        },
        {
            "hc-key": "nl-3558-gm0784",
            "value": 13
        },
        {
            "hc-key": "nl-3558-gm0758",
            "value": 14
        },
        {
            "hc-key": "nl-3558-gm0873",
            "value": 15
        },
        {
            "hc-key": "nl-3558-gm0772",
            "value": 16
        },
        {
            "hc-key": "nl-3558-gm0766",
            "value": 17
        },
        {
            "hc-key": "nl-3558-gm0855",
            "value": 18
        },
        {
            "hc-key": "nl-3558-gm0809",
            "value": 19
        },
        {
            "hc-key": "nl-3558-gm0779",
            "value": 20
        },
        {
            "hc-key": "nl-3558-gm1684",
            "value": 21
        },
        {
            "hc-key": "nl-3558-gm1702",
            "value": 22
        },
        {
            "hc-key": "nl-3558-gm0785",
            "value": 23
        },
        {
            "hc-key": "nl-3558-gm0797",
            "value": 24
        },
        {
            "hc-key": "nl-3558-gm0796",
            "value": 25
        },
        {
            "hc-key": "nl-3558-gm0865",
            "value": 26
        },
        {
            "hc-key": "nl-3558-gm1667",
            "value": 27
        },
        {
            "hc-key": "nl-3558-gm0798",
            "value": 28
        },
        {
            "hc-key": "nl-3558-gm0770",
            "value": 29
        },
        {
            "hc-key": "nl-3558-gm0823",
            "value": 30
        },
        {
            "hc-key": "nl-3558-gm1728",
            "value": 31
        },
        {
            "hc-key": "nl-3558-gm1771",
            "value": 32
        },
        {
            "hc-key": "nl-3558-gm0820",
            "value": 33
        },
        {
            "hc-key": "nl-3558-gm0824",
            "value": 34
        },
        {
            "hc-key": "nl-3558-gm0846",
            "value": 35
        },
        {
            "hc-key": "nl-3558-gm0845",
            "value": 36
        },
        {
            "hc-key": "nl-3558-gm0777",
            "value": 37
        },
        {
            "hc-key": "nl-3558-gm0794",
            "value": 38
        },
        {
            "hc-key": "nl-3558-gm1652",
            "value": 39
        },
        {
            "hc-key": "nl-3558-gm0860",
            "value": 40
        },
        {
            "hc-key": "nl-3558-gm0847",
            "value": 41
        },
        {
            "hc-key": "nl-3558-gm1659",
            "value": 42
        },
        {
            "hc-key": "nl-3558-gm0743",
            "value": 43
        },
        {
            "hc-key": "nl-3558-gm0856",
            "value": 44
        },
        {
            "hc-key": "nl-3558-gm0757",
            "value": 45
        },
        {
            "hc-key": "nl-3558-gm0861",
            "value": 46
        },
        {
            "hc-key": "nl-3558-gm1724",
            "value": 47
        },
        {
            "hc-key": "nl-3558-gm0866",
            "value": 48
        },
        {
            "hc-key": "nl-3558-gm0867",
            "value": 49
        },
        {
            "hc-key": "nl-3558-gm0874",
            "value": 50
        },
        {
            "hc-key": "nl-3558-gm0870",
            "value": 51
        },
        {
            "hc-key": "nl-3558-gm0738",
            "value": 52
        },
        {
            "hc-key": "nl-3558-gm0828",
            "value": 53
        },
        {
            "hc-key": "nl-3558-gm1671",
            "value": 54
        },
        {
            "hc-key": "nl-3558-gm1721",
            "value": 55
        },
        {
            "hc-key": "nl-3558-gm1706",
            "value": 56
        },
        {
            "hc-key": "nl-3558-gm0755",
            "value": 57
        },
        {
            "hc-key": "nl-3558-gm0858",
            "value": 58
        },
        {
            "hc-key": "nl-3558-gm0762",
            "value": 59
        },
        {
            "hc-key": "nl-3558-gm0756",
            "value": 60
        },
        {
            "hc-key": "nl-3558-gm0844",
            "value": 61
        },
        {
            "hc-key": "nl-3558-gm0826",
            "value": 62
        },
        {
            "hc-key": "nl-3558-gm0753",
            "value": 63
        },
        {
            "hc-key": "nl-3558-gm0848",
            "value": 64
        },
        {
            "hc-key": "nl-3558-gm0788",
            "value": 65
        },
        {
            "hc-key": "nl-3558-gm0786",
            "value": 66
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-nb-all.js">Noord-Brabant</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-nb-all'],
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
