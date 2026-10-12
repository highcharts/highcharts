Highcharts.chart('container', {
    dataTable: {
        columns: {
            Name: [
                'TRAPPIST-1', 'Wolf 359', 'Proxima Centauri', 'Barnard\'s Star',
                'Lalande 21185', 'Lacaille 8760', '61 Cygni B', '61 Cygni A',
                'Epsilon Indi A', 'Tau Ceti', 'Epsilon Eridani',
                'Alpha Centauri B', 'Sun', 'Alpha Centauri A', 'Altair',
                'Fomalhaut', 'Sirius A', 'Vega', 'Algol A', 'Alkaid',
                'Tau Scorpii', 'Theta¹ Orionis C'
            ],
            Mass: [
                0.09, 0.11, 0.122, 0.16, 0.39, 0.6, 0.63, 0.7, 0.76, 0.78,
                0.82, 0.91, 1, 1.08, 1.86, 1.92, 2.06, 2.15, 3.17, 5.07,
                15, 33
            ],
            Luminosity: [
                0.00055, 0.0011, 0.0016, 0.0035, 0.021, 0.072, 0.085, 0.15,
                0.21, 0.52, 0.34, 0.5, 1, 1.52, 10.6, 16.6, 25.4, 47.2, 182,
                574, 25000, 204000
            ]
        }
    },

    palette: {
        colorScheme: 'dark'
    },

    chart: {
        type: 'scatter',
        borderRadius: 4
    },

    title: {
        text: 'Main-sequence stars'
    },

    legend: {
        enabled: false
    },

    accessibility: {
        point: {
            valueDescriptionFormat:
                '{point.name}, mass {point.x} solar masses, ' +
                'luminosity {point.y} solar luminosities.'
        }
    },

    xAxis: {
        type: 'logarithmic',
        title: {
            text: 'Mass (solar masses)'
        }
    },

    yAxis: {
        type: 'logarithmic',
        title: {
            text: 'Luminosity (solar luminosities)'
        }
    },

    tooltip: {
        headerFormat: '<b>{point.key}</b><br />',
        pointFormat: 'Mass: {point.x} solar masses<br />' +
            'Luminosity: {point.y} solar luminosities'
    },

    series: [{
        name: 'Main-sequence stars',
        dataMapping: {
            x: 'Mass',
            y: 'Luminosity',
            name: 'Name'
        },
        color: 'yellow'
    }]
});
