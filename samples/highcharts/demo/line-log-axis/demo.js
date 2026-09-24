// Main-sequence stars: mass (solar masses) vs luminosity (solar luminosities)
const stars = [
    ['TRAPPIST-1', 0.09, 0.00055],
    ['Wolf 359', 0.11, 0.0011],
    ['Proxima Centauri', 0.122, 0.0016],
    ['Barnard\'s Star', 0.16, 0.0035],
    ['Lalande 21185', 0.39, 0.021],
    ['Lacaille 8760', 0.6, 0.072],
    ['61 Cygni B', 0.63, 0.085],
    ['61 Cygni A', 0.7, 0.15],
    ['Epsilon Indi A', 0.76, 0.21],
    ['Tau Ceti', 0.78, 0.52],
    ['Epsilon Eridani', 0.82, 0.34],
    ['Alpha Centauri B', 0.91, 0.5],
    ['Sun', 1.0, 1.0],
    ['Alpha Centauri A', 1.08, 1.52],
    ['Altair', 1.86, 10.6],
    ['Fomalhaut', 1.92, 16.6],
    ['Sirius A', 2.06, 25.4],
    ['Vega', 2.15, 47.2],
    ['Algol A', 3.17, 182],
    ['Alkaid', 5.07, 574],
    ['Tau Scorpii', 15.0, 25000],
    ['Theta¹ Orionis C', 33, 204000]
].map(([name, x, y]) => ({ name, x, y }));

Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },

    title: {
        text: 'Star mass vs luminosity'
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
        data: stars,
        color: 'var(--highcharts-color-1, #2caffe)'
    }]
});
