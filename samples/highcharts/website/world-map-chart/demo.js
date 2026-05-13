const commonOptions = {
    api: {
        url: 'https://demo-live-data.highcharts.com',
        access: {
            url: 'https://demo-live-data.highcharts.com/token/oauth',
            token: 'token'
        }
    }
};

const imgPath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@fcab8defe5/samples/graphics/world-map-icons/{filename}';

function parseData(regionalExposureData) {
    // Mapping region code to relevant country ISO code and development status
    const regionCountryMap = {

        // Americas: United States
        1: [
            ['US', 'd'] // United States (d)
        ],

        // Americas: Canada
        2: [
            ['CA', 'd'] // Canada (d)
        ],

        // Americas: Latin America
        3: [
            ['AI', 'e'], // Anguilla (e)
            ['AG', 'd'], // Antigua & Barbuda (d)
            ['AR', 'e'], // Argentina (e)
            ['AW', 'd'], // Aruba (d)
            ['BS', 'd'], // Bahamas (d)
            ['BB', 'd'], // Barbados (d)
            ['BZ', 'e'], // Belize (e)
            ['BM', 'd'], // Bermuda (d)
            ['BO', 'e'], // Bolivia (e)
            ['BQ', 'e'], // Bonaire (e)
            ['BR', 'e'], // Brazil (e)
            ['VG', 'e'], // British Virgin Islands (e)
            ['KY', 'd'], // Cayman Islands (d)
            ['CL', 'e'], // Chile (e)
            ['CO', 'e'], // Colombia (e)
            ['CR', 'e'], // Costa Rica (e)
            ['CU', 'e'], // Cuba (e)
            ['CW', 'e'], // Curacao (e)
            ['DM', 'e'], // Dominica (e)
            ['DO', 'e'], // Dominican Republic (e)
            ['EC', 'e'], // Ecuador (e)
            ['SV', 'e'], // El Salvador (e)
            ['FK', 'e'], // Falkland Islands (e)
            ['BL', 'e'], // French Antilles (e)
            ['GF', 'e'], // French Guiana (e)
            ['GD', 'e'], // Grenada (e)
            ['GP', 'e'], // Guadeloupe (e)
            ['GT', 'e'], // Guatemala (e)
            ['GY', 'e'], // Guyana (e)
            ['HT', 'e'], // Haiti (e)
            ['HN', 'e'], // Honduras (e)
            ['JM', 'e'], // Jamaica (e)
            ['MQ', 'e'], // Martinique (e)
            ['MX', 'e'], // Mexico (e)
            ['MS', 'e'], // Montserrat (e)
            ['NI', 'e'], // Nicaragua (e)
            ['PA', 'e'], // Panama (e)
            ['PY', 'e'], // Paraguay (e)
            ['PE', 'e'], // Peru (e)
            ['PR', 'd'], // Puerto Rico (d)
            ['KN', 'e'], // St. Kitts & Nevis (e)
            ['LC', 'e'], // St. Lucia (e)
            ['VC', 'e'], // St. Vincent & the Grenadines (e)
            ['SR', 'e'], // Suriname (e)
            ['TT', 'e'], // Trinidad & Tobago (e)
            ['TC', 'e'], // Turks & Caicos (e)
            ['UY', 'e'], // Uruguay (e)
            ['VE', 'e'] // Venezuela (e)
        ],

        // Greater Europe: United Kingdom
        4: [
            ['GB', 'd'], // United Kingdom (d)
            ['GG', 'd'], // Guernsey (d)
            ['IM', 'd'], // Isle of Man (d)
            ['JE', 'd'] // Jersey (d)
        ],

        // Greater Europe: Eurozone
        5: [
            ['AT', 'd'], // Austria (d)
            ['BE', 'd'], // Belgium (d)
            ['CY', 'd'], // Cyprus (d)
            ['EE', 'e'], // Estonia (e)
            ['FI', 'd'], // Finland (d)
            ['FR', 'd'], // France (d)
            ['DE', 'd'], // Germany (d)
            ['GR', 'd'], // Greece (d)
            ['IE', 'd'], // Ireland (d)
            ['IT', 'd'], // Italy (d)
            ['LV', 'e'], // Latvia (e)
            ['LU', 'd'], // Luxembourg (d)
            ['MT', 'd'], // Malta (d)
            ['NL', 'd'], // Netherlands (d)
            ['PT', 'd'], // Portugal (d)
            ['SK', 'e'], // Slovakia (e)
            ['SI', 'd'], // Slovenia (d)
            ['ES', 'd'] // Spain (d)
        ],

        // Greater Europe: Europe ex-Euro
        6: [
            ['AD', 'd'], // Andorra (d)
            ['DK', 'd'], // Denmark (d)
            ['FO', 'd'], // Faroe Islands (d)
            ['GI', 'e'], // Gibraltar (e)
            ['GL', 'd'], // Greenland (d)
            ['IS', 'd'], // Iceland (d)
            ['LI', 'd'], // Liechtenstein (d)
            ['MC', 'd'], // Monaco (d)
            ['NO', 'd'], // Norway (d)
            ['SM', 'd'], // San Marino (d)
            ['SJ', 'e'], // Svalbard (e)
            ['SE', 'd'], // Sweden (d)
            ['CH', 'd'], // Switzerland (d)
            ['VA', 'e'] // Vatican City (e)
        ],

        // Greater Europe: Europe Emerging
        7: [
            ['AL', 'e'], // Albania (e)
            ['BY', 'e'], // Belarus (e)
            ['BA', 'e'], // Bosnia & Herzegovina (e)
            ['BG', 'e'], // Bulgaria (e)
            ['HR', 'e'], // Croatia (e)
            ['CZ', 'e'], // Czech Republic (e)
            ['HU', 'e'], // Hungary (e)
            ['LT', 'e'], // Lithuania (e)
            ['MK', 'e'], // Macedonia (e)
            ['MD', 'e'], // Moldova (e)
            ['PL', 'e'], // Poland (e)
            ['RO', 'e'], // Romania (e)
            ['RU', 'e'], // Russia (e)
            ['RS', 'e'], // Serbia (e)
            ['ME', 'e'], // Montenegro (e)
            ['TR', 'e'], // Turkey (e)
            ['UA', 'e'] // Ukraine (e)
        ],

        // Greater Europe: Africa
        8: [
            ['DZ', 'e'], // Algeria (e)
            ['AO', 'e'], // Angola (e)
            ['BJ', 'e'], // Benin (e)
            ['BW', 'e'], // Botswana (e)
            ['BV', 'e'], // Bouvet Island (e)
            ['BF', 'e'], // Burkina Faso (e)
            ['BI', 'e'], // Burundi (e)
            ['CM', 'e'], // Cameroon (e)
            ['CV', 'e'], // Cape Verde (e)
            ['CF', 'e'], // Central African Republic (e)
            ['TD', 'e'], // Chad (e)
            ['KM', 'e'], // Comoros (e)
            ['CG', 'e'], // Congo (e)
            ['CI', 'e'], // Cote d'Ivoire (e)
            ['CD', 'e'], // Democratic Republic of Congo (e)
            ['DJ', 'e'], // Djibouti (e)
            ['EG', 'e'], // Egypt (e)
            ['GQ', 'e'], // Equatorial Guinea (e)
            ['ER', 'e'], // Eritrea (e)
            ['ET', 'e'], // Ethiopia (e)
            ['GA', 'e'], // Gabon (e)
            ['GM', 'e'], // Gambia (e)
            ['GH', 'e'], // Ghana (e)
            ['GN', 'e'], // Guinea (e)
            ['GW', 'e'], // Guinea-Bissau (e)
            ['KE', 'e'], // Kenya (e)
            ['LS', 'e'], // Lesotho (e)
            ['LR', 'e'], // Liberia (e)
            ['LY', 'e'], // Libya (e)
            ['MG', 'e'], // Madagascar (e)
            ['MW', 'e'], // Malawi (e)
            ['ML', 'e'], // Mali (e)
            ['MR', 'e'], // Mauritania (e)
            ['MU', 'e'], // Mauritius (e)
            ['YT', 'e'], // Mayotte (e)
            ['MA', 'e'], // Morocco (e)
            ['MZ', 'e'], // Mozambique (e)
            ['NA', 'e'], // Namibia (e)
            ['NE', 'e'], // Niger (e)
            ['NG', 'e'], // Nigeria (e)
            ['RE', 'e'], // Reunion Island (e)
            ['RW', 'e'], // Rwanda (e)
            ['ST', 'e'], // Sao Tome & Principe (e)
            ['SN', 'e'], // Senegal (e)
            ['SC', 'e'], // Seychelles (e)
            ['SL', 'e'], // Sierra Leone (e)
            ['SO', 'e'], // Somalia (e)
            ['ZA', 'e'], // South Africa (e)
            ['SH', 'e'], // St. Helena (e)
            ['SD', 'e'], // Sudan (e)
            ['SZ', 'e'], // Swaziland (e)
            ['TZ', 'e'], // Tanzania (e)
            ['TG', 'e'], // Togo (e)
            ['TN', 'e'], // Tunisia (e)
            ['UG', 'e'], // Uganda (e)
            ['EH', 'e'], // Western Sahara (e)
            ['ZM', 'e'], // Zambia (e)
            ['ZW', 'e'] // Zimbabwe (e)
        ],

        // Greater Europe: Middle East
        9: [
            ['BH', 'd'], // Bahrain (d)
            ['IR', 'e'], // Iran (e)
            ['IQ', 'e'], // Iraq (e)
            ['IL', 'd'], // Israel (d)
            ['JO', 'e'], // Jordan (e)
            ['KW', 'd'], // Kuwait (d)
            ['LB', 'e'], // Lebanon (e)
            ['OM', 'e'], // Oman (e)
            ['QA', 'd'], // Qatar (d)
            ['SA', 'e'], // Saudi Arabia (e)
            ['SY', 'e'], // Syria (e)
            ['AE', 'd'], // United Arab Emirates (d)
            ['PS', 'e'], // West Bank and Gaza (e)
            ['YE', 'e'] // Yemen (e)
        ],

        // Greater Asia: Japan
        10: [
            ['JP', 'd'] // Japan (d)
        ],

        // Greater Asia: Australasia
        11: [
            ['AU', 'd'], // Australia (d)
            ['NZ', 'd'] // New Zealand (d)
        ],

        // Greater Asia: Asia Developed
        12: [
            ['BN', 'd'], // Brunei (d)
            ['PF', 'd'], // French Polynesia (d)
            ['GU', 'd'], // Guam (d)
            ['HK', 'd'], // Hong Kong (d)
            ['MO', 'd'], // Macau (d)
            ['NC', 'd'], // New Caledonia (d)
            ['SG', 'd'], // Singapore (d)
            ['KR', 'd'], // South Korea (d)
            ['TW', 'd'] // Taiwan (d)
        ],

        // Greater Asia: Asia Emerging
        13: [
            ['AF', 'e'], // Afghanistan (e)
            ['AS', 'e'], // American Samoa (e)
            ['AM', 'e'], // Armenia (e)
            ['AZ', 'e'], // Azerbaijan (e)
            ['BD', 'e'], // Bangladesh (e)
            ['BT', 'e'], // Bhutan (e)
            ['MM', 'e'], // Burma (e)
            ['KH', 'e'], // Cambodia (e)
            ['CN', 'e'], // China (e)
            ['CX', 'e'], // Christmas Island (e)
            ['CC', 'e'], // Cocos Islands (e)
            ['CK', 'e'], // Cook Islands (e)
            ['TL', 'e'], // East Timor (e)
            ['FJ', 'e'], // Fiji (e)
            ['GE', 'e'], // Georgia (e)
            ['HM', 'e'], // Heard & McDonald Islands (e)
            ['IN', 'e'], // India (e)
            ['ID', 'e'], // Indonesia (e)
            ['KZ', 'e'], // Kazakhstan (e)
            ['KI', 'e'], // Kiribati (e)
            ['KG', 'e'], // Kyrgyzstan (e)
            ['LA', 'e'], // Laos (e)
            ['MY', 'e'], // Malaysia (e)
            ['MV', 'e'], // Maldives (e)
            ['MH', 'e'], // Marshall Islands (e)
            ['FM', 'e'], // Micronesia (e)
            ['MN', 'e'], // Mongolia (e)
            ['NR', 'e'], // Nauru (e)
            ['NP', 'e'], // Nepal (e)
            ['NU', 'e'], // Niue (e)
            ['NF', 'e'], // Norfolk Island (e)
            ['KP', 'e'], // North Korea (e)
            ['MP', 'e'], // Northern Mariana Islands (e)
            ['PK', 'e'], // Pakistan (e)
            ['PW', 'e'], // Palau (e)
            ['PG', 'e'], // Papua New Guinea (e)
            ['PH', 'e'], // Philippines (e)
            ['PN', 'e'], // Pitcairn Islands (e)
            ['WS', 'e'], // Samoa (e)
            ['SB', 'e'], // Solomon Islands (e)
            ['LK', 'e'], // Sri Lanka (e)
            ['TJ', 'e'], // Tajikistan (e)
            ['TH', 'e'], // Thailand (e)
            ['TK', 'e'], // Tokelau (e)
            ['TO', 'e'], // Tonga (e)
            ['TM', 'e'], // Turkmenistan (e)
            ['TV', 'e'], // Tuvalu (e)
            ['UZ', 'e'], // Uzbekistan (e)
            ['VU', 'e'], // Vanuatu (e)
            ['VN', 'e'], // Vietnam (e)
            ['WF', 'e'] // Wallis & Futuna Islands (e)
        ]
    };

    // Mapping region code to relevant region names
    const regionMap = {
        1: 'United States',
        2: 'Canada',
        3: 'Latin America',
        4: 'United Kingdom',
        5: 'Eurozone',
        6: 'Europe - ex Euro',
        7: 'Europe - Emerging',
        8: 'Africa',
        9: 'Middle East',
        10: 'Japan',
        11: 'Australasia',
        12: 'Asia - Developed',
        13: 'Asia - Emerging',
        14: 'Emerging Market',
        15: 'Developed Country'
    };

    // Mapping region code to icons
    const regionIconMap = {
        1: 'usa',
        2: 'canada',
        3: 'latin',
        4: 'uk',
        5: 'euro',
        6: 'euro',
        7: 'euro',
        8: 'africa',
        9: 'middle-east',
        10: 'japan',
        11: 'au',
        12: 'asia',
        13: 'asia'
    };

    // Storing exposure values by region
    const regionalExposure = {};

    regionalExposureData.forEach(([regionCode, ...exposures]) => {
        // Take the Net exposure column value
        regionalExposure[regionCode] = exposures[3];
    });

    const mapSeries = [],
        barSeries = [];

    // Processing each region's data
    for (const [regionCode, value] of Object.entries(regionalExposure)) {
        const regionName = regionMap[regionCode],
            iconPath = regionIconMap[regionCode],
            countries = regionCountryMap[regionCode] || [];

        // Only include regions with defined countries and positive values
        if (countries.length > 0 && value > 0) {
            mapSeries.push({
                name: regionName,
                data: countries.map(([country]) => ({
                    code: country,
                    value
                }))
            });

            barSeries.push({
                name: regionName,
                y: value,
                iconPath
            });

            barSeries.sort((a, b) => b.y - a.y);
        }
    }

    return {
        mapSeries,
        barSeries
    };
}

async function renderChart() {
    const securityDetailsConnector =
        new HighchartsConnectors.Morningstar.SecurityDetailsConnector({
            ...commonOptions,
            security: {
                id: 'GB00B581Z480',
                idType: 'ISIN'
            },
            converters: ['RegionalExposure']
        });

    await securityDetailsConnector.load();

    const regionalExposureData =
            securityDetailsConnector.getTable('RegionalExposure').getRows(),
        {
            mapSeries,
            barSeries
        } = parseData(regionalExposureData);

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    function highlightBarPoint(point) {
        const series = point.series,
            chart = series.chart;

        // Apply new style for single bar point
        point.update({
            color: '#DC2626'
        }, true, false);

        // Update the bar chart outline position
        series.customOutline
            .attr({
                x: 0,
                y: chart.plotHeight - point.shapeArgs.x + chart.plotTop - 40,
                width: chart.chartWidth,
                height: 60
            })
            .show();
    }

    // Render a chart that will be used in map tooltip
    function renderChartInTooltip(point) {
        Highcharts.chart('hc-tooltip', {
            chart: {
                type: 'bar',
                animation: false,
                width: 300,
                spacingTop: 20,
                height: 60
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: {
                lineWidth: 0,
                labels: {
                    useHTML: true,
                    format:
                        `<img src="${imgPath}${point.iconPath}.svg" ` +
                        'height="40" width="40" />',
                    y: -12
                },
                type: 'category'
            },
            yAxis: {
                visible: false,
                max: 100
            },
            plotOptions: {
                bar: {
                    animation: false,
                    minPointLength: 10,
                    enableMouseTracking: false,
                    pointWidth: 10,
                    grouping: false,
                    borderRadius: {
                        radius: 80,
                        where: 'all'
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: 'var(--highcharts-neutral-color-100)',
                            fontSize: '14px',
                            textOutline: 'none'
                        },
                        crop: false,
                        overflow: 'allow'
                    }
                }
            },
            series: [{
                // Add a series with value of 100, that acts as a background
                // for the progress bar chart
                data: [100],
                color: 'var(--highcharts-neutral-color-10)',
                dataLabels: {
                    enabled: false
                }
            }, {
                color: '#DC2626',
                data: [{
                    name: point.name,
                    y: point.y
                }],
                dataLabels: [{
                    align: 'left',
                    inside: true,
                    verticalAlign: 'bottom',
                    x: -5,
                    y: -10,
                    format: '{point.key}'
                }, {
                    align: 'right',
                    allowOverlap: true,
                    verticalAlign: 'bottom',
                    format: '{point.y:.2f}%',
                    y: -10,
                    alignTo: 'plotEdges'
                }]
            }]
        });
    }

    let highlightedPointIndex;
    // Reset the highlight styles for all bar and map points
    function resetHighlight(barSeries, allMapSeries) {
        const barChart = barSeries.chart,
            mapChart = allMapSeries[0].chart;

        mapChart.series.forEach(series => {
            series.setState('');
        });

        // Reset the styles for all bar and map points
        barSeries.points.forEach(point => {
            point.update({
                color: barSeries.options.color
            }, false);
        });

        barChart.redraw();
        mapChart.mapView.zoomBy();
        mapChart.tooltip.hide(0);
        barSeries.customOutline.hide();
    }

    function highlightPoints(chart) {
        const barSeries = chart.series[1],
            mapChart = Highcharts.charts[0],
            allMapSeries = mapChart.series,
            renderer = chart.renderer;

        // Prepare an outline for the bar chart points
        barSeries.customOutline = renderer
            .rect()
            .attr({
                fill: 'var(--highcharts-neutral-color-20)',
                stroke: 'transparent',
                r: 9,
                strokeWidth: 0,
                zIndex: 1
            })
            .add();

        // Add custom zoom levels for chosen regions
        const customZoomLevels = {
            'United Kingdom': {
                center: [2, 53],
                zoom: 4
            },
            Eurozone: {
                center: [10, 55],
                zoom: 3.5
            },
            'Europe - Emerging': {
                center: [100, 60],
                zoom: 2.5
            }
        };

        // Add event listeners to the bar chart
        ['mousemove', 'touchmove', 'touchstart'].forEach(eventType => {
            document
                .getElementById('bar-container')
                .addEventListener(eventType, e => {
                    const event = chart.pointer.normalize(e),
                        point = barSeries.searchPoint(event, true);

                    if (point && point.index !== highlightedPointIndex) {
                        // Add throttling for updates
                        highlightedPointIndex = point.index;

                        resetHighlight(barSeries, allMapSeries);

                        // Highlight the region on the map, zoom in and show the
                        // tooltip
                        allMapSeries.forEach(series => {
                            if (series.name === point.name) {
                                const bounds = series.bounds,
                                    mapPoint =
                                        series.points.find(p => p.graphic) ||
                                        series.points[0];

                                series.update({
                                    color: 'var(--highcharts-neutral-color-100)'
                                }, false);

                                if (customZoomLevels[series.name]) {
                                    const {
                                        center,
                                        zoom
                                    } = customZoomLevels[series.name];
                                    mapChart.mapView.setView(center, zoom);
                                } else {
                                    mapChart.mapView.fitToBounds(bounds);
                                }

                                mapChart.tooltip.refresh(mapPoint);
                                mapChart.pointer.applyInactiveState([mapPoint]);
                                mapPoint.setState('hover');
                                renderChartInTooltip(point);
                            }
                        });

                        mapChart.redraw();
                        highlightBarPoint(point);
                    }
                });
        });

        ['mouseleave', 'touchend'].forEach(eventType => {
            document
                .getElementById('bar-container')
                .addEventListener(eventType, () => {
                    resetHighlight(barSeries, allMapSeries);
                    highlightedPointIndex = void 0;
                });
        });
    }

    Highcharts.mapChart('map-container', {
        chart: {
            map: topology,
            backgroundColor: 'transparent'
        },
        title: {
            text: ''
        },
        mapView: {
            projection: {
                name: 'Miller'
            }
        },
        credits: {
            enabled: false
        },
        colorAxis: {
            min: 0,
            max: 100,
            minColor: '#DC2626',
            maxColor: '#7F1D1D',
            labels: {
                format: '{value}%',
                overflow: 'allow'
            },
            width: '50%'
        },
        tooltip: {
            useHTML: true,
            headerFormat: '',
            pointFormat: '<div id="hc-tooltip"></div>',
            backgroundColor: 'transparent',
            shadow: false,
            hideDelay: 9999
        },
        plotOptions: {
            map: {
                showInLegend: false,
                borderColor: 'var(--highcharts-neutral-color-10)',
                borderWidth: 1,
                allAreas: false,
                joinBy: ['iso-a2', 'code'],
                nullColor: 'var(--highcharts-neutral-color-20)',
                states: {
                    hover: {
                        borderColor: 'var(--highcharts-neutral-color-3)'
                    }
                },
                events: {
                    mouseOver() {
                        this.update({
                            color: 'var(--highcharts-neutral-color-100)'
                        });

                        const barSeries = Highcharts.charts[1].series[1];
                        const point = barSeries.points.find(
                            point => point.name === this.name
                        );

                        // Render the tooltip first to create a div for the
                        // 'renderChartInTooltip' method
                        this.chart.tooltip.refresh(
                            this.points.find(p => p.graphic) ||
                            this.points[0]
                        );

                        highlightBarPoint(point);
                        renderChartInTooltip(point);
                    },
                    mouseOut() {
                        const barSeries = Highcharts.charts[1].series[1],
                            allMapSeries = this.chart.series;

                        this.chart.tooltip.hide(0);

                        resetHighlight(barSeries, allMapSeries);
                    }
                }
            }
        },
        series: [{
            name: 'World Map',
            allAreas: true
        }, ...mapSeries]
    });

    Highcharts.chart('bar-container', {
        chart: {
            type: 'bar',
            events: {
                load() {
                    highlightPoints(this);
                }
            }
        },
        title: {
            text: 'Regional Exposure World Map',
            align: 'left',
            style: {
                fontSize: '22px'
            }
        },
        xAxis: {
            lineWidth: 0,
            labels: {
                useHTML: true,
                format:
                    `<img src="${imgPath}` +
                    '{axis.series.1.options.data.(pos).iconPath}.svg" ' +
                    'height="40" width="40" />',
                y: -12
            },
            type: 'category'
        },
        credits: {
            text: `Copyright (c) 2026 Highsoft AS, Based on data from Natural
            Earth | Highcharts.com ©`,
            position: {
                align: 'left',
                x: 0
            }
        },
        yAxis: {
            visible: false,
            max: 100
        },
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            bar: {
                minPointLength: 10,
                enableMouseTracking: false,
                pointWidth: 10,
                grouping: false,
                borderWidth: 0,
                borderRadius: {
                    radius: 80,
                    where: 'all'
                },
                dataLabels: {
                    enabled: true,
                    style: {
                        color: 'var(--highcharts-neutral-color-100)',
                        fontSize: '14px',
                        textOutline: 'none'
                    }
                }
            }
        },
        series: [{
            // Add a series with values of 100, that acts as a background
            // for the progress bar chart
            dataLabels: {
                enabled: false
            },
            data: Array.from({ length: barSeries.length }, () => 100),
            color: 'var(--highcharts-neutral-color-10)'
        }, {
            dataLabels: [{
                align: 'left',
                inside: true,
                verticalAlign: 'bottom',
                x: -5,
                y: -10,
                format: '{point.key}'
            }, {
                align: 'right',
                allowOverlap: true,
                verticalAlign: 'bottom',
                format: '{point.y:.2f}%',
                y: -10,
                alignTo: 'plotEdges'
            }],
            color: 'var(--highcharts-neutral-color-100)',
            data: barSeries
        }]
    });
}

renderChart();
