

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/680f5d50a47e90f53d814b53f80ce1850b9060c0/samples/data/world-population-density.json', function (data) {

    // Initiate the chart
    Highcharts.mapChart('container', {

        title: {
            text: 'Point click event test'
        },

        colorAxis: {
            min: 1,
            max: 1000,
            type: 'logarithmic'
        },

        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function () {
                            location.href = 'https://en.wikipedia.org/wiki/' + this.name;
                        }
                    }
                }
            }
        },

        series: [{
            data: data,
            mapData: Highcharts.maps['custom/world'],
            joinBy: ['iso-a2', 'code'],
            name: 'Population density',
            cursor: 'pointer',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },
            tooltip: {
                pointFormat: '{point.name}: {point.value}/km²<br><span style="color:gray;font-size:11px">Click to view Wikipedia article</span>'
            }
        }]
    });
});