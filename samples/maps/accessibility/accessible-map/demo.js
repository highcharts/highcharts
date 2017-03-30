
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/nordic-countries',
        description: 'Chart displays population data for the Nordic Countries. Sweden is by far the most populated country, with nearly 10 million people. Denmark follows with around 5.6 million. The least populated country is the Faroe Islands, with 50 thousand inhabitants.'
    },

    title: {
        text: 'Population of the Nordic Countries'
    },

    subtitle: {
        text: 'Demo of an accessible interactive map'
    },

    xAxis: {
        title: {
            text: 'Country' // Visible in data table only
        }
    },

    mapNavigation: {
        enabled: true
    },

    legend: {
        enabled: false
    },

    colorAxis: {
        min: 0
    },

    series: [{
        name: 'Population',
        data: [
            ['is', 331918],
            ['no', 5207689],
            {
                'hc-key': 'se',
                value: 9801616,
                description: 'This is the most populated nordic country'
            },
            ['dk', 5581503],
            ['fi', 5476922],
            ['gl', 57733],
            ['fo', 50196]
        ],
        dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            formatter: function () {
                if (this.point.value) {
                    return this.point.name;
                }
            }
        }
    }],

    credits: {
        position: {
            align: 'center'
        }
    }
});