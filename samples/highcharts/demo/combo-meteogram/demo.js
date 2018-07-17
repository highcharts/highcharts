/**
 * This is a complex demo of how to set up a Highcharts chart, coupled to a
 * dynamic source and extended by drawing image sprites, wind arrow paths
 * and a second grid on top of the chart. The purpose of the demo is to inpire
 * developers to go beyond the basic chart types and show how the library can
 * be extended programmatically. This is what the demo does:
 *
 * - Loads weather forecast from www.yr.no in form of an XML service. The XML
 *   is translated on the Higcharts website into JSONP for the sake of the demo
 *   being shown on both our website and JSFiddle.
 * - When the data arrives async, a Meteogram instance is created. We have
 *   created the Meteogram prototype to provide an organized structure of the different
 *   methods and subroutines associated with the demo.
 * - The parseYrData method parses the data from www.yr.no into several parallel arrays. These
 *   arrays are used directly as the data option for temperature, precipitation
 *   and air pressure. As the temperature data gives only full degrees, we apply
 *   some smoothing on the graph, but keep the original data in the tooltip.
 * - After this, the options structure is build, and the chart generated with the
 *   parsed data.
 * - In the callback (on chart load), we weather icons on top of the temperature series.
 *   The icons are sprites from a single PNG image, placed inside a clipped 30x30
 *   SVG <g> element. VML interprets this as HTML images inside a clipped div.
 * - Lastly, the wind arrows are built and added below the plot area, and a grid is
 *   drawn around them. The wind arrows are basically drawn north-south, then rotated
 *   as per the wind direction.
 */

function Meteogram(xml, container) {
    // Parallel arrays for the chart data, these are populated as the XML/JSON file
    // is loaded
    this.symbols = [];
    this.precipitations = [];
    this.precipitationsError = []; // Only for some data sets
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.xml = xml;
    this.container = container;

    // Run
    this.parseYrData();
}

/**
 * Function to smooth the temperature line. The original data provides only whole degrees,
 * which makes the line graph look jagged. So we apply a running mean on it, but preserve
 * the unaltered value in the tooltip.
 */
Meteogram.prototype.smoothLine = function (data) {
    var i = data.length,
        sum,
        value;

    while (i--) {
        data[i].value = value = data[i].y; // preserve value for tooltip

        // Set the smoothed value to the average of the closest points, but don't allow
        // it to differ more than 0.5 degrees from the given value
        sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
        data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
    }
};

/**
 * Draw the weather symbols on top of the temperature series. The symbols are
 * fetched from yr.no's MIT licensed weather symbol collection.
 * https://github.com/YR/weather-symbols
 */
Meteogram.prototype.drawWeatherSymbols = function (chart) {
    var meteogram = this;

    $.each(chart.series[0].data, function (i, point) {
        if (meteogram.resolution > 36e5 || i % 2 === 0) {

            chart.renderer
                .image(
                    'https://cdn.rawgit.com/YR/weather-symbols/6.0.2/dist/svg/' +
                        meteogram.symbols[i] + '.svg',
                    point.plotX + chart.plotLeft - 8,
                    point.plotY + chart.plotTop - 30,
                    30,
                    30
                )
                .attr({
                    zIndex: 5
                })
                .add();
        }
    });
};


/**
 * Draw blocks around wind arrows, below the plot area
 */
Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    var xAxis = chart.xAxis[0],
        x,
        pos,
        max,
        isLong,
        isLast,
        i;

    for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {

        // Get the X position
        isLast = pos === max + 36e5;
        x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        if (this.resolution > 36e5) {
            isLong = pos % this.resolution === 0;
        } else {
            isLong = i % 2 === 0;
        }
        chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
            'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
            .attr({
                'stroke': chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }

      // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};

/**
 * Get the title based on the XML data
 */
Meteogram.prototype.getTitle = function () {
    return 'Meteogram for ' + this.xml.querySelector('location name').textContent +
        ', ' + this.xml.querySelector('location country').textContent;
};

/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    var meteogram = this;

    return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 310,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        defs: {
            patterns: [{
                'id': 'precipitation-error',
                'path': {
                    d: [
                        'M', 3.3, 0, 'L', -6.7, 10,
                        'M', 6.7, 0, 'L', -3.3, 10,
                        'M', 10, 0, 'L', 0, 10,
                        'M', 13.3, 0, 'L', 3.3, 10,
                        'M', 16.7, 0, 'L', 6.7, 10
                    ].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1
                }
            }]
        },

        title: {
            text: this.getTitle(),
            align: 'left',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        credits: {
            text: 'Forecast from <a href="http://yr.no">yr.no</a>',
            href: this.xml.querySelector('credit link').getAttribute('url'),
            position: {
                x: -40
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                '<b>{point.point.symbolName}</b><br>'

        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'hPa',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: Highcharts.getOptions().colors[2]
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: Highcharts.getOptions().colors[2]
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.value}°C</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Precipitation',
            data: this.precipitationsError,
            type: 'column',
            color: 'url(#precipitation-error)',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                valueSuffix: ' mm',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.minvalue} mm - {point.maxvalue} mm</b><br/>'
            },
            grouping: false,
            dataLabels: {
                enabled: meteogram.hasPrecipitationError,
                formatter: function () {
                    if (this.point.maxvalue > 0) {
                        return this.point.maxvalue;
                    }
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            }
        }, {
            name: 'Precipitation',
            data: this.precipitations,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !meteogram.hasPrecipitationError,
                formatter: function () {
                    if (this.y > 0) {
                        return this.y;
                    }
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
            tooltip: {
                valueSuffix: ' mm'
            }
        }, {
            name: 'Air pressure',
            color: Highcharts.getOptions().colors[2],
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' hPa'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: Highcharts.getOptions().colors[1],
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' m/s'
            }
        }]
    };
};

/**
 * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
 */
Meteogram.prototype.onChartLoad = function (chart) {

    this.drawWeatherSymbols(chart);
    this.drawBlocksForWindArrows(chart);

};

/**
 * Create the chart. This function is called async when the data file is loaded and parsed.
 */
Meteogram.prototype.createChart = function () {
    var meteogram = this;
    this.chart = new Highcharts.Chart(this.getChartOptions(), function (chart) {
        meteogram.onChartLoad(chart);
    });
};

Meteogram.prototype.error = function () {
    $('#loading').html('<i class="fa fa-frown-o"></i> Failed loading data, please try again later');
};

/**
 * Handle the data. This part of the code is not Highcharts specific, but deals with yr.no's
 * specific data format
 */
Meteogram.prototype.parseYrData = function () {

    var meteogram = this,
        xml = this.xml,
        pointStart,
        forecast = xml && xml.querySelector('forecast');

    if (!forecast) {
        return this.error();
    }

    // The returned xml variable is a JavaScript representation of the provided
    // XML, generated on the server by running PHP simple_load_xml and
    // converting it to JavaScript by json_encode.
    Highcharts.each(
        forecast.querySelectorAll('tabular time'),
        function (time, i) {
            // Get the times - only Safari can't parse ISO8601 so we need to do
            // some replacements
            var from = time.getAttribute('from') + ' UTC',
                to = time.getAttribute('to') + ' UTC';

            from = from.replace(/-/g, '/').replace('T', ' ');
            from = Date.parse(from);
            to = to.replace(/-/g, '/').replace('T', ' ');
            to = Date.parse(to);

            if (to > pointStart + 4 * 24 * 36e5) {
                return;
            }

            // If it is more than an hour between points, show all symbols
            if (i === 0) {
                meteogram.resolution = to - from;
            }

            // Populate the parallel arrays
            meteogram.symbols.push(
                time.querySelector('symbol').getAttribute('var')
                    .match(/[0-9]{2}[dnm]?/)[0]
            );

            meteogram.temperatures.push({
                x: from,
                y: parseInt(
                    time.querySelector('temperature').getAttribute('value'),
                    10
                ),
                // custom options used in the tooltip formatter
                to: to,
                symbolName: time.querySelector('symbol').getAttribute('name')
            });

            var precipitation = time.querySelector('precipitation');
            meteogram.precipitations.push({
                x: from,
                y: parseFloat(
                    Highcharts.pick(
                        precipitation.getAttribute('minvalue'),
                        precipitation.getAttribute('value')
                    )
                )
            });

            if (precipitation.getAttribute('maxvalue')) {
                meteogram.hasPrecipitationError = true;
                meteogram.precipitationsError.push({
                    x: from,
                    y: parseFloat(precipitation.getAttribute('maxvalue')),
                    minvalue: parseFloat(precipitation.getAttribute('minvalue')),
                    maxvalue: parseFloat(precipitation.getAttribute('maxvalue')),
                    value: parseFloat(precipitation.getAttribute('value'))
                });
            }

            if (i % 2 === 0) {
                meteogram.winds.push({
                    x: from,
                    value: parseFloat(time.querySelector('windSpeed')
                        .getAttribute('mps')),
                    direction: parseFloat(time.querySelector('windDirection')
                        .getAttribute('deg'))
                });
            }

            meteogram.pressures.push({
                x: from,
                y: parseFloat(time.querySelector('pressure').getAttribute('value'))
            });

            if (i === 0) {
                pointStart = (from + to) / 2;
            }
        }
    );

    // Smooth the line
    this.smoothLine(this.temperatures);

    // Create the chart when the data is loaded
    this.createChart();
};
// End of the Meteogram protype



 // On DOM ready...

// Set the hash to the yr.no URL we want to parse
var place,
    url;
if (!location.hash) {
    place = 'United_Kingdom/England/London';
    //place = 'France/Rhône-Alpes/Val_d\'Isère~2971074';
    //place = 'Norway/Sogn_og_Fjordane/Vik/Målset';
    //place = 'United_States/California/San_Francisco';
    //place = 'United_States/Minnesota/Minneapolis';

    location.hash = 'https://www.yr.no/place/' + place + '/forecast_hour_by_hour.xml';
}

// Then get the XML file through Highcharts' CORS proxy. Our proxy is limited to
// this specific location. Useing the third party, rate limited cors.io service
// for experimenting with other locations.
url = location.hash.substr(1);
$.ajax({
    dataType: 'xml',
    url: url === 'https://www.yr.no/place/United_Kingdom/England/London/forecast_hour_by_hour.xml' ?
        'https://www.highcharts.com/samples/data/cors.php?url=' + url :
        'https://cors.io/?' + url,
    success: function (xml) {
        window.meteogram = new Meteogram(xml, 'container');
    },
    error: Meteogram.prototype.error
});
