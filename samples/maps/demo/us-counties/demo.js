Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@c116b6fa6948448/samples/data/us-counties-unemployment.json',
    function (data) {

        /**
         * Data parsed from http://www.bls.gov/lau/#tables
         *
         * 1. Go to http://www.bls.gov/lau/laucntycur14.txt (or similar, updated
         *    datasets)
         * 2. In the Chrome Developer tools console, run this code:
         *    copy(JSON.stringify(document.body.innerHTML.split('\n').filter(function (s) { return s.indexOf('<PUT DATE HERE IN FORMAT e.g. Feb-14>') !== -1; }).map(function (row) { row = row.split('|'); return { code: 'us-' + row[3].trim().slice(-2).toLowerCase() + '-' + row[2].trim(), name: row[3].trim(), value: parseFloat(row[8]) }; })))
         * 3. The data is now on your clipboard, paste it below
         * 4. Verify that the length of the data is reasonable, about 3300
         *    counties.
         */

        var countiesMap = Highcharts.geojson(
                Highcharts.maps['countries/us/us-all-all']
            ),
            // Extract the line paths from the GeoJSON
            lines = Highcharts.geojson(
                Highcharts.maps['countries/us/us-all-all'], 'mapline'
            ),
            // Filter out the state borders and separator lines, we want these
            // in separate series
            borderLines = Highcharts.grep(lines, function (l) {
                return l.properties['hc-group'] === '__border_lines__';
            }),
            separatorLines = Highcharts.grep(lines, function (l) {
                return l.properties['hc-group'] === '__separator_lines__';
            });

        // Add state acronym for tooltip
        Highcharts.each(countiesMap, function (mapPoint) {
            mapPoint.name = mapPoint.name + ', ' +
                mapPoint.properties['hc-key'].substr(3, 2);
        });

        document.getElementById('container').innerHTML = 'Rendering map...';

        // Create the map
        setTimeout(function () { // Otherwise innerHTML doesn't update
            Highcharts.mapChart('container', {
                chart: {
                    borderWidth: 1,
                    marginRight: 20 // for the legend
                },

                title: {
                    text: 'US Counties unemployment rates, January 2018'
                },

                legend: {
                    layout: 'vertical',
                    align: 'right',
                    floating: true,
                    backgroundColor: ( // theme
                        Highcharts.defaultOptions &&
                        Highcharts.defaultOptions.legend &&
                        Highcharts.defaultOptions.legend.backgroundColor
                    ) || 'rgba(255, 255, 255, 0.85)'
                },

                mapNavigation: {
                    enabled: true
                },

                colorAxis: {
                    min: 0,
                    max: 25,
                    tickInterval: 5,
                    stops: [[0, '#F1EEF6'], [0.65, '#900037'], [1, '#500007']],
                    labels: {
                        format: '{value}%'
                    }
                },

                plotOptions: {
                    mapline: {
                        showInLegend: false,
                        enableMouseTracking: false
                    }
                },

                series: [{
                    mapData: countiesMap,
                    data: data,
                    joinBy: ['hc-key', 'code'],
                    name: 'Unemployment rate',
                    tooltip: {
                        valueSuffix: '%'
                    },
                    borderWidth: 0.5,
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    shadow: false
                }, {
                    type: 'mapline',
                    name: 'State borders',
                    data: borderLines,
                    color: 'white',
                    shadow: false
                }, {
                    type: 'mapline',
                    name: 'Separator',
                    data: separatorLines,
                    color: 'gray',
                    shadow: false
                }]
            });
        }, 0);
    }
);
