(async function () {
    const countriesResp = await fetch("https://pomber.github.io/covid19/timeseries.json");
    const countries = await countriesResp.json();
    const populationResp = await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json');
    const population = await populationResp.json();

    let countryChart;

    // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
    const mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
    const populationByName = {};
    mapData.forEach(function (country) {
        country.id = country.properties['hc-key']; // for Chart.get()
        country.flag = country.id.replace('UK', 'GB').toLowerCase();

        const pop = population.find(
            c => country.properties['hc-key'].toUpperCase() === c.code
        );
        populationByName[country.name] = pop && pop.z || null;
    });

    // Names used in Highcharts Map Collection
    countries['United States of America'] = countries.US;

    let maxValue = 0;
    const data = Object.keys(countries).map(name => {
        const country = countries[name];
        const confirmed = country[country.length - 1].confirmed;
        if (populationByName[name]) {
            const value = confirmed / populationByName[name];
            if (populationByName[name] > 1000) {
                maxValue = Math.max(value, maxValue);
            }
            return { name, value };
        }
        return { name, value: null };
    });


    // Initiate the map chart
    const mapChart = Highcharts.mapChart('container', {

        title: {
            text: 'Confirmed Covid-19 Cases'
        },

        subtitle: {
            text: 'Source: <a href="https://github.com/pomber/covid19">pomber/covid19</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            minColor: '#ffeeee',
            maxColor: '#aa0000',
            max: maxValue
        },

        tooltip: {
            footerFormat: '<span style="font-size: 10px">(Click for details)</span>',
            valueDecimals: 2,
            valueSuffix: ' per 1000 inhabitants'
        },

        legend: {
            title: {
                text: 'Cases per 1000 inhabitants',
                style: {
                    fontWeight: 'normal'
                }
            }
        },

        series: [{
            data: data,
            mapData: mapData,
            joinBy: ['name', 'name'],
            name: 'Confirmed cases',
            allowPointSelect: true,
            cursor: 'pointer',
            states: {
                select: {
                    color: undefined,
                    borderColor: 'black',
                    dashStyle: 'shortdot'
                }
            },
            borderWidth: 0.5
        }]
    });

    // Wrap point.select to get to the total selected points
    Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var points = mapChart.getSelectedPoints();
        if (points.length) {
            if (points.length === 1) {
                document.querySelector('#info #flag')
                    .className = 'flag ' + points[0].flag;
                document.querySelector('#info #flag').style.display = '';
                document.querySelector('#info h2').innerHTML = points[0].name;
                document.querySelector('#info .subheader')
                    .innerHTML = '<h5>Confirmed cases, starting the day before the 200th case</h5>' +
                        '<small><em>Shift + Click on map to compare countries</em></small>';

            } else {
                document.querySelector('#info #flag').style.display = 'none';
                document.querySelector('#info h2').innerHTML = 'Comparing countries';
                document.querySelector('#info .subheader')
                    .innerHTML = '<h5>Confirmed cases, starting the day before the 200th case</h5>';
            }

            if (!countryChart) {
                countryChart = Highcharts.chart('country-chart', {
                    chart: {
                        spacingLeft: 0,
                        animation: {
                            duration: 250
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        crosshair: true,
                        allowDecimals: false,
                        labels: {
                            format: 'Day #{value}'
                        }
                    },
                    yAxis: {
                        title: null,
                        opposite: true
                    },
                    tooltip: {
                        headerFormat: '<small>Day {point.x}</small><br>',
                        pointFormat: '<b>{point.date:%b %e, %Y}</b><br>{point.y} confirmed cases'
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            animation: {
                                duration: 50
                            },
                            label: {
                                enabled: true
                            },
                            marker: {
                                enabled: false
                            },
                            threshold: 0
                        }
                    }
                });
            }

            countryChart.series.slice(0).forEach(function (s) {
                s.remove(false);
            });
            const store = [];
            points.forEach(function (p) {
                const firstDayAbove200 = countries[p.name].findIndex(
                    point => point.confirmed >= 200
                );
                const data = countries[p.name]
                    .slice(Math.max(firstDayAbove200 - 1, 0))
                    .map((point, x) => {
                        const [year, month, date] = point.date.split('-');
                        const d = Date.UTC(year, month - 1, date);
                        return {
                            date: d,
                            x,
                            y: point.confirmed
                        };
                    });
                countryChart.addSeries({
                    name: p.name,
                    data,
                    type: points.length > 1 ? 'line' : 'area',
                    color: points.length > 1 ? undefined : '#aa0000',
                    fillColor: points.length > 1 ? undefined : p.color
                }, false);
                store.push(p.id);
            });
            localStorage.setItem('selected', store.join(','));
            countryChart.redraw();

        } else {
            document.querySelector('#info #flag').className = '';
            document.querySelector('#info h2').innerHTML = '';
            document.querySelector('#info .subheader').innerHTML = '';
            if (countryChart) {
                countryChart = countryChart.destroy();
            }
        }
    });

    // Pre-select countries
    const selected = localStorage.getItem('selected') || 'cn,it,us';
    selected.split(',').forEach(id => {
        mapChart.get(id).select(true, true);
    });
}());
