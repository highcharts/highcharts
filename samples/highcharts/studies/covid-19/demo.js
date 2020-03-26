document.addEventListener('DOMContentLoaded', async function () {
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
    countries['South Korea'] = countries['Korea, South'];

    let maxValue = 0;
    const data = Object.keys(countries).map(name => {
        const country = countries[name];
        const total = country[country.length - 1].confirmed;
        if (populationByName[name]) {
            const value = total / populationByName[name];
            if (populationByName[name] > 1000) {
                maxValue = Math.max(value, maxValue);
            }
            return { name, value, total };
        }
        return { name, value: null };
    });


    // Initiate the map chart
    const mapChart = Highcharts.mapChart('container', {

        chart: {
            spacingLeft: 1,
            spacingRight: 1
        },

        title: {
            text: null
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
            headerFormat: '<b>{point.point.name}</b><br>',
            pointFormat: '<b>{point.total}</b> confirmed cases<br>' +
                '<b>{point.value:.2f}</b> per 1000 inhabitants<br>',
            footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
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
            id: 'map',
            data: data,
            mapData: mapData,
            joinBy: ['name', 'name'],
            name: 'Confirmed cases',
            cursor: 'pointer',
            states: {
                select: {
                    color: undefined,
                    borderColor: '#333'
                }
            },
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.05)'
        }]
    });

    // Wrap point.select to get to the total selected points
    const onCountryClick = e => {

        // Accumulate using modifier keys, or on touch
        if (e && e.target && e.target.point) {
            e.preventDefault();
            e.target.point.select(
                null,
                e.ctrlKey || e.metaKey || e.shiftKey || e.type === 'touchstart'
            );
            if (e.target.point.selected) {
                e.target.point.graphic.toFront();
            }
        }

        const points = mapChart.getSelectedPoints();
        if (points.length) {
            if (e && e.type === 'touchstart') {
                //document.querySelector('#reset').style.display = 'block';
            }

            if (points.length === 1) {

                document.querySelector('#info #flag').style.display = 'block';
                document.querySelector('#info #flag')
                    .className = 'flag ' + points[0].flag;
                document.querySelector('#info .header-text').style.paddingLeft = '40px';
                document.querySelector('#info .header-text').innerHTML = points[0].name;
                document.querySelector('#info .subheader')
                    .innerHTML = 'Confirmed cases, starting the day before the 200th case<br>';

                if (e && e.type === 'touchstart') {
                    document.querySelector('#info .subheader')
                        .innerHTML += '<small><em>Tap on map to compare multiple countries</em></small>';
                } else {
                    document.querySelector('#info .subheader')
                        .innerHTML += '<small><em>Shift+Click on map to compare multiple countries</em></small>';
                }

            } else {
                document.querySelector('#info #flag').style.display = 'none';
                document.querySelector('#info .header-text').style.paddingLeft = 0;
                document.querySelector('#info .header-text').innerHTML = 'Comparing countries';
                document.querySelector('#info .subheader')
                    .innerHTML = 'Confirmed cases, starting the day before the 200th case<br>';
            }

            if (!countryChart) {
                countryChart = Highcharts.chart('country-chart', {
                    chart: {
                        spacingLeft: 0
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
                        headerFormat: '<small>{series.name}</small><br>',
                        pointFormat: '<b>Day {point.x}: {point.date:%b %e, %Y}</b><br>{point.y} confirmed cases'
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
                if (
                    !points.find(p => s.options.id === p.id) ||
                    s.type === 'area'
                ) {
                    s.remove(false);
                }
            });
            const store = [];
            points.forEach(function (p) {
                if (countries[p.name]) {
                    if (!countryChart.get(p.id)) {
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
                            id: p.id,
                            name: p.name,
                            data,
                            type: points.length > 1 ? 'line' : 'area',
                            color: points.length > 1 ? undefined : '#aa0000',
                            fillColor: points.length > 1 ? undefined : p.color
                        }, false);
                    }
                    store.push(p.id);
                }
            });
            location.hash = store.join(',');
            countryChart.redraw();

        // No selected points
        } else {
            //document.querySelector('#reset').style.display = 'none';
            document.querySelector('#info #flag').className = '';
            document.querySelector('#info .header-text').innerHTML = '';
            document.querySelector('#info .subheader').innerHTML = '';
            if (countryChart) {
                countryChart = countryChart.destroy();
            }
        }
    };
    mapChart.container.querySelectorAll('.highcharts-point').forEach(
        graphic => {
            graphic.addEventListener('click', onCountryClick);
            graphic.addEventListener('touchstart', onCountryClick);
        }
    );

    // Pre-select countries
    let selected = 'cn,it,us';
    if (location.hash) {
        selected = location.hash.replace('#', '');
    }
    selected.split(',').forEach(id => {
        if (/^[a-z]{2}$/.test(id)) {
            const country = mapChart.get(id);
            if (country) {
                mapChart.get(id).select(true, true);
            }
        }
    });
    onCountryClick();

    // Activate button
    /*
    const resetMap = () => {
        mapChart.getSelectedPoints().forEach(p => {
            p.select(false);
        });
        onCountryClick();
    };
    document.getElementById('reset').addEventListener('click', resetMap);
    document.getElementById('reset').addEventListener('touchstart', resetMap);
    */
});
