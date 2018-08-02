
// The demo uses https://api.met.no/ API. Every AJAX
// call downloads the XML format data, basing on specific capital
// city latitude and longitude values.

// Data structure: [country_code, latitude, longitude, capital_city]
var newData = [
    ['dk', 55.66, 12.58, 'Copenhagen'],
    ['fo', 62, -6.79, 'Torshavn'],
    ['hr', 45.8, 16, 'Zagreb'],
    ['nl', 52.35, 4.91, 'Amsterdam'],
    ['ee', 59.43, 24.71, 'Tallinn'],
    ['bg', 42.68, 23.31, 'Sofia'],
    ['es', 40.4, -3.68, 'Madrid'],
    ['it', 41.9, 12.48, 'Rome'],
    ['sm', 43.93, 12.41, 'San Marino'],
    ['va', 41.9, 12.45, 'Vatican'],
    ['tr', 39.93, 32.86, 'Ankara'],
    ['mt', 35.88, 14.5, 'Valetta'],
    ['fr', 48.86, 2.33, 'Paris'],
    ['no', 59.91, 10.75, 'Oslo'],
    ['de', 52.51, 13.4, 'Berlin'],
    ['ie', 53.31, -6.23, 'Dublin'],
    ['ua', 50.43, 30.51, 'Kyiv'],
    ['fi', 60.16, 24.93, 'Helsinki'],
    ['se', 59.33, 18.05, 'Stockholm'],
    ['ru', 55.75, 37.6, 'Moscow'],
    ['gb', 51.5, -0.08, 'London'],
    ['cy', 35.16, 33.36, 'Nicosia'],
    ['pt', 38.71, -9.13, 'Lisbon'],
    ['gr', 37.98, 23.73, 'Athens'],
    ['lt', 54.68, 25.31, 'Vilnius'],
    ['si', 46.05, 14.51, 'Ljubljana'],
    ['ba', 43.86, 18.41, 'Sarajevo'],
    ['mc', 43.73, 7.41, 'Monaco'],
    ['al', 41.31, 19.81, 'Tirana'],
    ['nc', 35.18, 33.36, 'North Nicosia'],
    ['rs', 44.83, 20.5, 'Belgrade'],
    ['ro', 44.43, 26.1, 'Bucharest'],
    ['me', 42.43, 19.26, 'Podgorica'],
    ['li', 47.13, 9.51, 'Vaduz'],
    ['at', 48.2, 16.36, 'Vienna'],
    ['sk', 48.15, 17.11, 'Bratislava'],
    ['hu', 47.5, 19.08, 'Budapest'],
    ['ad', 42.2, 1.24, 'Andorra la Vella'],
    ['lu', 49.6, 6.11, 'Luxembourg'],
    ['ch', 46.91, 7.46, 'Bern'],
    ['be', 50.83, 4.33, 'Brussels'],
    ['pl', 52.25, 21, 'Warsaw'],
    ['mk', 42, 21.43, 'Skopje'],
    ['lv', 56.95, 24.1, 'Riga'],
    ['by', 53.9, 27.56, 'Minsk'],
    ['is', 64.15, -21.95, 'Reykjavik'],
    ['md', 47, 28.85, 'Chisinau'],
    ['cz', 50.08, 14.46, 'Prague']
];
// Get temperature for specific localization, and add it to the chart.
// It takes point as first argument, countries series as second
// and capitals series as third. Capitals series have to be the
// 'mappoint' series type, and it should be defined before in the
// series array.
function getTemp(point, countries, capitals) {
    $.ajax({
        url: 'https://api.met.no/weatherapi/locationforecast/1.9/?lat=' +
            point[1] + '&lon=' + point[2],
        complete: function (data) {
            var colorAxis = countries.chart.colorAxis[0];

            // Parse received data
            var xml = $.parseXML(data.responseText, "text/xml");
            var temp = $(xml).find('#TTT').attr('value');
            var country = {
                'hc-key': point[0],
                value: parseInt(temp, 10) || null
            };
            var capital = {
                name: point[3],
                lat: point[1],
                lon: point[2],
                color: colorAxis.toColor(temp),
                temp: parseInt(temp, 10) || 'No data'
            };

            countries.addPoint(country);
            capitals.addPoint(capital);
        }
    });
}

// Create the chart
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/europe',
        animation: false,
        events: {
            load: function () {
                var countries = this.series[0];
                var capitals = this.series[1];
                newData.forEach(function (elem) {
                    getTemp(elem, countries, capitals);
                });
            }
        }
    },

    title: {
        text: 'Current temperatures in capitals of Europe'
    },

    subtitle: {
        text: 'Data source: <a href="https://api.met.no/">https://api.met.no/</a>'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {
        min: -25,
        max: 40,
        labels: {
            format: '{value}°C'
        },
        stops: [
            [0, '#0000ff'],
            [0.3, '#6da5ff'],
            [0.6, '#ffff00'],
            [1, '#ff0000']
        ]
    },

    legend: {
        title: {
            text: 'Degrees of Celsius'
        }
    },

    tooltip: {
        headerFormat: '<span style="color:{point.color}">\u25CF</span> {point.key}:<br/>',
        pointFormatter: function () {
            var value = Number.isInteger(this.temp) ? this.temp + '°C' : 'No data';
            return 'Temperature: <b>' + value + '</b>';
        }
    },

    series: [{
        name: 'Temperatures',
        states: {
            hover: {
                color: '#BADA55'
            }
        },
        dataLabels: {
            enabled: false
        },
        enableMouseTracking: false
    }, {
        name: 'Capitals of Europe',
        type: 'mappoint',
        showInLegend: false,
        marker: {
            lineWidth: 1,
            lineColor: '#000'
        },
        dataLabels: {
            formatter: function () {
                var value = Number.isInteger(this.point.temp) ? this.point.temp + '°C' : 'No data';
                return '<span>' + this.key + '</span><br/><span>' + value + '</span>';
            }
        }
    }]
});
