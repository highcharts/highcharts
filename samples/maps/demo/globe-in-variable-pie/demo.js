// Conversion factor metric tons to troy ounces
const metricTonsToOunces = 32150.7;

let data = [
    // Name, Metric tons gold reserves, population (M)
    {
        name: 'United States of America',
        metricTons: 8133.46,
        population: 334.9
    },
    { name: 'Germany', metricTons: 3352.65, population: 84.48 },
    { name: 'Italy', metricTons: 2451.84, population: 58.76 },
    { name: 'France', metricTons: 2436.97, population: 68.17 },
    { name: 'Russia', metricTons: 2332.74, population: 143.83 },
    { name: 'China', metricTons: 2235.39, population: 1410.71 },
    { name: 'Switzerland', metricTons: 1040.00, population: 8.85 },
    { name: 'Japan', metricTons: 845.97, population: 124.52 },
    { name: 'India', metricTons: 803.58, population: 1428.63 },
    { name: 'Netherlands', metricTons: 612.45, population: 17.88 }
];

// Adding troy ounces per capita and sorting by this
data = data.map(point => ({
    ...point,
    ouncesPerCapita: Math.round(
        100 * point.metricTons * metricTonsToOunces /
        (point.population * 1000000)
    ) / 100
})).sort((a, b) => b.ouncesPerCapita - a.ouncesPerCapita);


const getGraticule = () => {
    const data = [];

    // Meridians
    for (let x = -180; x <= 180; x += 15) {
        data.push({
            geometry: {
                type: 'LineString',
                coordinates:
                    x % 90 === 0 ?
                        [
                            [x, -90],
                            [x, 0],
                            [x, 90]
                        ] : [
                            [x, -80],
                            [x, 80]
                        ]
            }
        });
    }

    // Latitudes
    for (let y = -90; y <= 90; y += 10) {
        const coordinates = [];
        for (let x = -180; x <= 180; x += 5) {
            coordinates.push([x, y]);
        }
        data.push({
            geometry: {
                type: 'LineString',
                coordinates
            },
            lineWidth: y === 0 ? 1 : undefined
        });
    }

    return data;
};

(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
    ).then(response => response.json());
    const mapData = topology.objects.default.geometries.map(country => [
        country.properties['hc-key'],
        country.id
    ]);
    const countries = topology.objects.default.geometries.filter(el =>
        data.map(c => c.name).includes(el.properties.name)
    );
    const rotation = countryName => {
        const countryProperties = countries.find(
            g => g.properties.name === countryName
        ).properties;
        return [
            -countryProperties['hc-middle-lon'],
            -countryProperties['hc-middle-lat']
        ];
    };

    // Adjust data table view
    Highcharts.addEvent(Highcharts.Chart, 'exportData', function (e) {
        e.dataRows.forEach(function (el) {
            el.splice(0, 2);
        });
    });

    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology,
            height: '80%',
            events: {
                load() {
                    const chart = this;
                    chart.rotateToCountry = countryName => {
                        const point1 =
                                chart.mapView.projection.options.rotation,
                            point2 = rotation(countryName),
                            distance = Highcharts.Projection.distance(
                                point1,
                                point2
                            );

                        if (!distance) {
                            return;
                        }
                        const stepDistance = distance / 1000,
                            geodesic = Highcharts.Projection.geodesic(
                                chart.mapView.projection.options.rotation,
                                rotation(countryName),
                                true,
                                stepDistance
                            );

                        chart.renderer.boxWrapper.animator = 0;

                        const animateGlobe = () => new Promise(resolve => {
                            Highcharts.animate(
                                chart.renderer.boxWrapper,
                                { animator: 999 },
                                {
                                    duration: 1000,
                                    step: (now, fx) => {
                                        const rotation =
                                            geodesic[Math.round(now)];
                                        chart.mapView.update(
                                            {
                                                projection: {
                                                    rotation
                                                }
                                            },
                                            true,
                                            false
                                        );

                                        // Resolve after animation
                                        if (fx.pos === 1) {
                                            resolve();
                                        }
                                    }
                                }
                            );
                        });

                        // Set rotation state as chart property
                        (async () => {
                            chart.isRotating = true;
                            await animateGlobe();
                            chart.isRotating = false;
                        })();
                    };

                    chart.findCountry = countryName =>
                        this.series[1].data.find(
                            p => p.name === countryName
                        );
                },
                redraw() {
                    const chart = this;
                    // "Reset" view to account for manual globe rotation
                    chart.mapView.fitToBounds(undefined, undefined, false);
                    chart.renderSea?.();
                },
                render() {
                    const chart = this,
                        renderer = chart.renderer;

                    // Responsive rules cause the render event to fire before
                    // the load event. Therefore, we need to create these
                    // functions on the render event instead.

                    if (!chart.renderSea) {
                        // Render a circle filled with a radial gradient behind
                        // the globe to make it appear as the sea around the
                        // continents
                        chart.renderSea = () => {
                            let verb = 'animate';
                            if (!chart.sea) {
                                chart.sea = renderer
                                    .circle()
                                    .attr({
                                        fill: {
                                            radialGradient: {
                                                cx: 0.4,
                                                cy: 0.4,
                                                r: 0.65,
                                                fx: 0.3,
                                                fy: 0.3
                                            },
                                            stops: [
                                                [0, '#fffbe6'],
                                                [0.15, '#FFEB80'],
                                                [0.4, '#F0CA00'],
                                                [0.8, '#957D00'],
                                                [1, '#524500']
                                            ]
                                        },
                                        zIndex: -1
                                    })
                                    .add(chart.get('graticule').group);
                                verb = 'attr';
                            }

                            const bounds = chart.get('graticule').bounds,
                                p1 = chart.mapView.projectedUnitsToPixels({
                                    x: bounds.x1,
                                    y: bounds.y1
                                }),
                                p2 = chart.mapView.projectedUnitsToPixels({
                                    x: bounds.x2,
                                    y: bounds.y2
                                });
                            chart.sea[verb]({
                                cx: (p1.x + p2.x) / 2,
                                cy: (p1.y + p2.y) / 2,
                                r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
                            });
                        };
                        chart.renderSea();
                    }

                    if (!chart.getStickyLabel) {
                        chart.getStickyLabel = () => {
                            const point = chart.getSelectedPoints()[0],
                                countryName = point.name,
                                text = `<b>${countryName}</b>
                                    <br/><b>Gold Reserves</b>
                                    <br/>Total: <b>
                                    ${Highcharts.numberFormat(point.y)} t</b>
                                    <br/>Per capita:
                                    <b>
                                    ${Highcharts.numberFormat(point.z)} oz t
                                    </b>`;

                            if (!chart.sticky) {
                                chart.sticky = renderer
                                    .label()
                                    .attr({
                                        fill: {
                                            linearGradient: {
                                                x1: 0.1,
                                                y2: 0.2
                                            },
                                            stops: [
                                                [0.3, '#ccb339'],
                                                [0.6, '#fff1a2'],
                                                [0.9, '#ccb339']
                                            ]
                                        }
                                    })
                                    .shadow(true)
                                    .add();
                                chart.sticky.box.attr({
                                    rx: 5
                                });
                            }

                            chart.sticky.attr({
                                text
                            });
                        };
                    }

                    // Avoid rerendering while chart is rotating
                    if (!chart.isRotating || chart.justSelectedPoint) {
                        chart.justSelectedPoint = false;
                        const pieSeries = chart.get('pieseries'),
                            [
                                centerX, centerY, d, innerD
                            ] = pieSeries.center,
                            innerR = innerD / 2,
                            r = d / 2,
                            cx = centerX + chart.plotLeft,
                            cy = centerY + chart.plotTop,
                            fontSizeAxes = innerR > 85 ? '0.8em' : '0.5em',
                            fontSizeSticky = innerR > 85 ? '1em' : '0.7em';

                        // Adding "axes" to indicate what type
                        // of data is in the variable pie series
                        chart.customAxes?.destroy();
                        chart.customAxes = renderer.g().add();

                        // Radial axis
                        const radialAxis = renderer.path([
                            'M', cx - 3, cy - innerR, 'L', cx - 3, cy - r
                        ]).attr({
                            stroke: 'var(--highcharts-neutral-color-80, #444)',
                            'stroke-width': 2
                        }).add(chart.customAxes);

                        // Radial axis title
                        renderer.text(
                            'PER CAPITA'
                        ).setTextPath(radialAxis, {
                            attributes: {
                                dy: -8
                            }
                        }).attr({
                            'font-size': fontSizeAxes,
                            'font-weight': 'bold',
                            fill: 'var(--highcharts-neutral-color-80, #444)'
                        }).add(chart.customAxes);

                        // Angular axis
                        const angularAxisR = innerR + 1;
                        renderer.path([
                            'M', cx - angularAxisR, cy, 'A', angularAxisR,
                            angularAxisR, 0, 0, 1, cx - 2, cy - angularAxisR
                        ]).attr({
                            stroke: 'var(--highcharts-neutral-color-80, #444)',
                            'stroke-width': 2
                        }).add(chart.customAxes);

                        // Angular axis title
                        const angularAxisTitleR = angularAxisR + 3;
                        const angularAxisTitlePath = renderer.path([
                            'M', cx - angularAxisTitleR, cy, 'A',
                            angularAxisTitleR, angularAxisTitleR,
                            0, 0, 1, cx, cy - angularAxisTitleR
                        ]).add(chart.customAxes);

                        renderer.text('GOLD RESERVES')
                            .setTextPath(angularAxisTitlePath, {
                            }).attr({
                                'font-size': fontSizeAxes,
                                'font-weight': 'bold',
                                fill: 'var(--highcharts-neutral-color-80, #444)'
                            })
                            .add(chart.customAxes);

                        if (chart.getSelectedPoints().length === 1) {
                            chart.getStickyLabel();

                            // Align sticky label
                            chart.sticky.css({
                                fontSize: fontSizeSticky
                            });
                            const labelWidth = chart.sticky.bBox.width,
                                x = cx - labelWidth - 40;
                            chart.sticky.attr({
                                x: x > 0 ? x : 0,
                                y: cy - r
                            });
                        }
                    }
                }
            }
        },

        credits: {
            enabled: false
        },

        title: {
            text: '2023 Top 10 Countries by Gold Reserves',
            style: {
                fontSize: '28px'
            }
        },

        subtitle: {
            text: 'In metric tons held by the respective country\'s central bank. Sources: <a href="https://www.gold.org/goldhub/data/gold-reserves-by-country" target="_blank">gold.org</a> and <a href="https://databank.worldbank.org/reports.aspx?source=2&series=SP.POP.TOTL&year=2023" target="_blank">World Bank</a>.'
        },

        legend: {
            enabled: false
        },

        mapView: {
            padding: ['41%', '30%', '23%', '30%'],
            projection: {
                name: 'Orthographic',
                rotation: rotation('France')
            }
        },

        plotOptions: {
            variablepie: {
                dataLabels: {
                    style: {
                        fontSize: '1em'
                    },
                    connectorColor: 'var(--highcharts-neutral-color-80, #444)'
                },
                includeInDataExport: true
            },
            series: {
                animation: {
                    duration: 1000
                },
                includeInDataExport: false
            }
        },

        exporting: {
            csv: {
                columnHeaderFormatter: (_, key) => ({
                    population: 'Population (M)',
                    y: 'Gold Reserves (t)',
                    z: 'Gold per Capita (oz t)'
                }[key] || 'Country')
            }
        },

        tooltip: {
            style: {
                fontSize: '1em'
            },
            valueDecimals: 2,
            useHTML: true,
            headerFormat:
                `<table>
                    <tr>
                        <th colspan="2" style="font-weight: bold">
                            {point.key}
                        </th>
                    </tr>`,
            pointFormat:
                `<tr>
                    <td>Population:</td>
                    <td><b>{point.population} M</b></td>
                </tr>
                <tr>
                    <td>Gold Reserves:</td>
                    <td><b>{point.y} t</b></td>
                </tr>
                <tr>
                    <td>Per Capita:</td>
                    <td><b>{point.z} oz t</b></td>
                </tr>`,
            footerFormat: '</table>'
        },

        series: [
            {
                name: 'Graticule',
                id: 'graticule',
                type: 'mapline',
                data: getGraticule(),
                nullColor: '#22201520',
                accessibility: {
                    enabled: false
                },
                enableMouseTracking: false,
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
            {
                name: 'Map',
                data: mapData,
                keys: ['hc-key', 'id'],
                accessibility: {
                    enabled: false
                },
                enableMouseTracking: false,
                borderColor: '#b39700',
                borderWidth: 0.5,
                color: '#222015',
                states: {
                    inactive: {
                        opacity: 1
                    }
                }
            },
            {
                name: 'Countries',
                id: 'pieseries',
                type: 'variablepie',
                allowPointSelect: true,
                borderColor: '#493f0f',
                inactiveOtherPoints: false,
                cursor: 'pointer',
                innerSize: '45%',
                size: '100%',
                center: ['50%', '60%'],
                endAngle: 270,
                borderRadius: 5,
                keys: ['countryID', 'name', 'population', 'y', 'z'],
                data: data.map(pointData => [
                    countries.find(
                        country => country.properties.name ===
                                pointData.name
                    ).id,
                    pointData.name,
                    pointData.population,
                    pointData.metricTons,
                    pointData.ouncesPerCapita
                ]
                ),
                colors:
                    [
                        '#ccb339',
                        '#d2ba45',
                        '#d7c150',
                        '#ddc85c',
                        '#e3ce68',
                        '#e8d673',
                        '#eedc7f',
                        '#f4e38b',
                        '#f9ea96',
                        '#fff1a2'
                    ],
                point: {
                    events: {
                        unselect() {
                            const point = this,
                                countryName = point.name,
                                mapPoint = chart.findCountry(countryName);
                            mapPoint.update({
                                color: null
                            });

                            if (countryName === chart.selectedCountry) {
                                chart.sticky = chart.sticky?.destroy();
                            }
                        },
                        select() {
                            const point = this,
                                selectedPoints = chart.getSelectedPoints(),
                                countryName = point.name,
                                mapPoint = chart.findCountry(countryName);
                            mapPoint.update({
                                color: '#ffffff99'
                            });
                            chart.selectedCountry = countryName;
                            chart.justSelectedPoint = true;

                            // Remove previously selected points
                            // from selectedPoints array
                            selectedPoints.forEach(point => {
                                if (point.name !== countryName) {
                                    point.select(false);
                                }
                            });

                            chart.redraw({
                                defer: 500,
                                complete() {
                                    // Circumvent "rogue" firing of this
                                    // function by only initiating globe
                                    // rotation if globe is not rotating
                                    if (!chart.isRotating) {
                                        chart.rotateToCountry(countryName);
                                    }
                                }
                            });
                        },
                        click(e) {
                            // Prevent selecting a new country
                            // while the globe is rotating
                            if (chart.isRotating) {
                                e.preventDefault();
                            }
                        }
                    }
                }
            }
        ],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 650
                },
                chartOptions: {
                    chart: {
                        height: '120%'
                    },
                    plotOptions: {
                        variablepie: {
                            dataLabels: {
                                distance: 5,
                                connectorColor: 'transparent',
                                padding: 0,
                                style: {
                                    fontSize: '1em'
                                },
                                format: '{point.countryID}'
                            }
                        }
                    }
                }
            }]
        }
    });
})();
