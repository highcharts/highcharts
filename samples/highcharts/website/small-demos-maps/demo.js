const  mapbuttons = {
    theme: {
        fill: '#46465C',
        'stroke-width': 1,
        stroke: '#BBBAC5',
        r: 2,
        style: {
            color: '#fff'
        },
        states: {
            hover: {
                fill: '#000',
                'stroke-width': 1,
                stroke: '#f0f0f0',
                style: {
                    color: '#fff'
                }
            },

            select: {
                fill: '#000',
                'stroke-width': 1,
                stroke: '#f0f0f0',
                style: {
                    color: '#fff'
                }
            }
        }
    },
    verticalAlign: 'bottom'
};

let chartToShow = 'spider';

const params = (new URL(document.location)).search;

const pArray = params.split('&');

let chartStr = '';

pArray.forEach(function (element) {
    if (element.indexOf('charts=') !== -1) {
        chartStr = element;
    }
});

const chartArray = chartStr.split('=');
if (chartArray.length > 1) {
    chartToShow = chartArray[1];
}

function spider() {
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world.topo.json'
        ).then(response => response.json());

        const data = [
            ['Atlanta', 'USA', '1996', 33.75, -84.38, 7, 2, 2, 3],
            ['Sydney', 'Australia', '2020', -33.87, 151.20, 10, 4, 3, 3],
            ['Athens', 'Greece', '2004', 38, 23.72, 6, 5, 0, 1],
            ['Beijing', 'China', '2008', 39.92, 116.38, 9, 3, 5, 1],
            ['London', 'Great Britain', '2012', 51.5, -0.12, 4, 2, 1, 1],
            ['Rio de Janeiro', 'Brazil', '2016', -22.91, -43.20, 4, 0, 0, 4],
            ['Tokyo', 'Japan', '2020', 35.69, 139.69, 8, 4, 2, 2]
        ];

        Highcharts.mapChart('container', {

            chart: {
                map: topology,
                margin: [0, 0, 10, 0]
            },

            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            mapView: {
                zoom: 1.25
            },
            mapNavigation: {
                enabled: true,
                enableMouseWheelZoom: false,
                buttons: {
                    zoomIn: {
                        x: 5,
                        y: 5
                    },
                    zoomOut: {
                        x: 5,
                        y: 31
                    }
                },
                buttonOptions: mapbuttons
            },

            title: {
                text: '',
                floating: true
            },

            subtitle: {
                text: '',
                floating: true
            },

            tooltip: {
                headerFormat: '',
                pointFormat: '{point.city} ({point.country}, {point.year})<br/>' +
                    'Total medals: {point.z}<br/>' +
                    '<span style="color: #ffd700;">\u25CF</span> {point.gold}<br/>' +
                    '<span style="color: #c0c0c0;">\u25CF</span> {point.silver}<br/>' +
                    '<span style="color: #cd7f32;">\u25CF</span> {point.bronze}<br/>'
            },

            series: [{
                name: 'World map',
                nullColor: '#fad3cf'
            }, {
                name: 'Olympic games',
                type: 'mapbubble',
                color: '#fe5f55',
                lineWidth: 1,
                keys: ['city', 'country', 'year', 'lat', 'lon', 'z', 'gold', 'silver', 'bronze'],
                data: data,
                minSize: '5%',
                maxSize: '12.5%',
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{point.city}, {point.country}, {point.year}. Total medals: {point.z}. Gold: {point.gold}, silver: {point.silver}, bronze: {point.bronze}.'
                    }
                }
            }],
            responsive: {
                rules: [
                    // up to 219
                    {
                        condition: {
                            // /up tp this
                            maxWidth: 219
                        },
                        chartOptions: {
                            chart: {
                                height: 150
                            },
                            mapView: {
                                zoom: 0.5
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 220
                        },
                        chartOptions: {
                            chart: {
                                height: 260
                            },
                            colorAxis: {
                                visible: false
                            }
                        }
                    }
                ]
            }

        });

    })();

}

function temps() {
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/europe.topo.json'
        ).then(response => response.json());

        // The demo uses https://api.met.no/ API. Every AJAX
        // call downloads the XML format data, basing on specific capital
        // city latitude and longitude values.


        async function getJSON(url, cb) {
            const request = await fetch(url).then(response => response.json());
            return cb(request);
        }

        // Data structure: [country_code, latitude, longitude, capital_city]
        const newData = [
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

            const url = 'https://api.met.no/weatherapi/locationforecast/2.0/?lat=' +
            point[1] + '&lon=' + point[2];

            const callBack = json => {

                const temp = json.properties.timeseries[0].data.instant.details
                    .air_temperature;
                const colorAxis = countries.chart.colorAxis[0];

                const country = {
                    'hc-key': point[0],
                    value: parseInt(temp, 10) || null
                };
                const capital = {
                    name: point[3],
                    lat: point[1],
                    lon: point[2],
                    color: colorAxis.toColor(temp),
                    temp: parseInt(temp, 10) || 'No data'
                };

                countries.addPoint(country);
                capitals.addPoint(capital);
                return temp;
            };

            getJSON(url, callBack);
        }

        // Create the chart
        Highcharts.mapChart('container', {
            chart: {
                map: topology,
                animation: false,
                margin: [0, 0, 10, 0],
                events: {
                    load: function () {
                        const countries = this.series[0];
                        const capitals = this.series[1];
                        newData.forEach(function (elem) {
                            getTemp(elem, countries, capitals);
                        });
                    }
                }
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },

            subtitle: {
                text: ''
            },

            mapNavigation: {
                enabled: true,
                enableMouseWheelZoom: false,
                buttonOptions: mapbuttons,
                buttons: {
                    zoomIn: {
                        x: 5,
                        y: 5
                    },
                    zoomOut: {
                        x: 5,
                        y: 31
                    }
                }
            },
            mapView: {
                zoom: 4
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
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                margin: 20,
                floating: false,
                padding: 8,
                y: 20,
                navigation: {
                    enabled: false
                }
            },

            tooltip: {
                headerFormat: '<span style="color:{point.color}">\u25CF</span> {point.key}:<br/>',
                pointFormatter: function () {
                    const value = Number.isInteger(this.temp) ? this.temp + '°C' : 'No data';
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
                enableMouseTracking: false,
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}, {point.value}°C.'
                    }
                }
            }, {
                name: 'Capitals of Europe',
                type: 'mappoint',
                showInLegend: false,
                marker: {
                    lineWidth: 1,
                    lineColor: '#000'
                },
                dataLabels: {
                    crop: true,
                    formatter: function () {
                        const value = Number.isInteger(this.point.temp) ? this.point.temp + '°C' : 'No data';
                        return '<span>' + this.key + '</span><br/><span>' + value + '</span>';
                    }
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}, {point.temp}°C.'
                    }
                }
            }],
            responsive: {
                rules: [
                    // /up to 219
                    {
                        condition: {
                            // /up tp this
                            maxWidth: 219
                        },
                        chartOptions: {
                            chart: {
                                height: 150
                            },
                            mapView: {
                                zoom: 4
                            },
                            legend: {
                                enabled: false
                            },
                            colorAxis: {
                                visible: false
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 220
                        },
                        chartOptions: {
                            chart: {
                                height: 260
                            },
                            colorAxis: {
                                visible: false
                            }
                        }
                    }
                ]
            }
        });

    })();
}

function clusters() {
    (async () => {

        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/europe.topo.json'
        ).then(response => response.json());

        const data = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@1e9e659c2d60fbe27ef0b41e2f93112dd68fb7a3/samples/data/european-train-stations-near-airports.json'
        ).then(response => response.json());

        Highcharts.mapChart('container', {
            chart: {
                map: topology,
                margin: [0, 0, 10, 0]
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: mapbuttons,
                buttons: {
                    zoomIn: {
                        x: 5,
                        y: 5
                    },
                    zoomOut: {
                        x: 5,
                        y: 31
                    }
                },
                enableMouseWheelZoom: false
            },
            mapView: {
                center: [17, 54],
                zoom: 3.8
            },
            tooltip: {
                formatter: function () {
                    if (this.point.clusteredData) {
                        return 'Clustered points: ' + this.point.clusterPointsAmount;
                    }
                    return '<b>' + this.key + '</b><br>Lat: ' + this.point.lat.toFixed(2) + ', Lon: ' + this.point.lon.toFixed(2);
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                margin: 20,
                floating: false,
                padding: 8,
                y: 20,
                navigation: {
                    enabled: false
                }
            },
            colorAxis: {
                lineColor: 'black',
                minColor: '#D9DBF8',
                maxColor: '#E1D369',
                style: {
                    fontSize: '10px'
                }
            },
            plotOptions: {
                mappoint: {
                    cluster: {
                        enabled: true,
                        allowOverlap: false,
                        animation: {
                            duration: 450
                        },
                        marker: {
                            lineColor: '#000',
                            lineWidth: 1
                        },
                        dataLabels: {
                            style: {
                                color: '#000',
                                textOutline: '#fff',
                                fontWeight: 'bold'
                            }
                        },
                        layoutAlgorithm: {
                            type: 'grid',
                            gridSize: 70
                        },
                        zones: [{
                            from: 1,
                            to: 4,
                            marker: {
                                radius: 13
                            }
                        }, {
                            from: 5,
                            to: 9,
                            marker: {
                                radius: 15
                            }
                        }, {
                            from: 10,
                            to: 15,
                            marker: {
                                radius: 17
                            }
                        }, {
                            from: 16,
                            to: 20,
                            marker: {
                                radius: 19
                            }
                        }, {
                            from: 21,
                            to: 100,
                            marker: {
                                radius: 21
                            }
                        }]
                    }
                }
            },
            series: [{
                name: 'Basemap',
                borderColor: '#A0A0A0',
                nullColor: '#A3EDBA',
                showInLegend: false
            }, {
                type: 'mappoint',
                enableMouseTracking: true,
                colorKey: 'clusterPointsAmount',
                name: 'Cities',
                color: '#5749AD',
                data: data
            }],
            responsive: {
                rules: [
                    // /up to 219
                    {
                        condition: {
                            // /up tp this
                            maxWidth: 219
                        },
                        chartOptions: {
                            chart: {
                                height: 150
                            },
                            mapView: {
                                zoom: 2
                            },
                            colorAxis: {
                                visible: false
                            }
                        }
                    },
                    {
                        condition: {
                            minWidth: 220
                        },
                        chartOptions: {
                            chart: {
                                height: 260
                            },
                            colorAxis: {
                                visible: false
                            },
                            mapView: {
                                zoom: 3.8
                            }
                        }
                    }
                ]
            }
        });

    })();
}

function projection() {
    const data = [
        {
            name: 'United States of America',
            value: 1477
        },
        {
            name: 'Brazil',
            value: 490
        },
        {
            name: 'Mexico',
            value: 882
        },
        {
            name: 'Canada',
            value: 161
        },
        {
            name: 'Russia',
            value: 74
        },
        {
            name: 'Argentina',
            value: 416
        },
        {
            name: 'Bolivia',
            value: 789
        },
        {
            name: 'Colombia',
            value: 805
        },
        {
            name: 'Paraguay',
            value: 2011
        },
        {
            name: 'Indonesia',
            value: 372
        },
        {
            name: 'South Africa',
            value: 466
        },
        {
            name: 'Papua New Guinea',
            value: 1239
        },
        {
            name: 'Germany',
            value: 1546
        },
        {
            name: 'China',
            value: 54
        },
        {
            name: 'Chile',
            value: 647
        },
        {
            name: 'Australia',
            value: 62
        },
        {
            name: 'France',
            value: 844
        },
        {
            name: 'United Kingdom',
            value: 1901
        },
        {
            name: 'Venezuela',
            value: 503
        },
        {
            name: 'Ecuador',
            value: 1560
        },
        {
            name: 'India',
            value: 116
        },
        {
            name: 'Iran',
            value: 208
        },
        {
            name: 'Guatemala',
            value: 2716
        },
        {
            name: 'Philippines',
            value: 828
        },
        {
            name: 'Sweden',
            value: 563
        },
        {
            name: 'Saudi Arabia',
            value: 100
        },
        {
            name: 'Democratic Republic of the Congo',
            value: 87
        },
        {
            name: 'Kenya',
            value: 346
        },
        {
            name: 'Zimbabwe',
            value: 507
        },
        {
            name: 'Peru',
            value: 149
        },
        {
            name: 'Ukraine',
            value: 323
        },
        {
            name: 'Angola',
            value: 141
        },
        {
            name: 'Japan',
            value: 480
        },
        {
            name: 'United Republic of Tanzania',
            value: 187
        },
        {
            name: 'Costa Rica',
            value: 3153
        },
        {
            name: 'Algeria',
            value: 66
        },
        {
            name: 'Pakistan',
            value: 196
        },
        {
            name: 'Spain',
            value: 301
        },
        {
            name: 'Finland',
            value: 487
        },
        {
            name: 'Nicaragua',
            value: 1225
        },
        {
            name: 'Libya',
            value: 83
        },
        {
            name: 'Cuba',
            value: 1211
        },
        {
            name: 'Uruguay',
            value: 760
        },
        {
            name: 'Oman',
            value: 426
        },
        {
            name: 'Italy',
            value: 439
        },
        {
            name: 'Czech Republic',
            value: 1657
        },
        {
            name: 'Poland',
            value: 414
        },
        {
            name: 'New Zealand',
            value: 465
        },
        {
            name: 'Guyana',
            value: 594
        },
        {
            name: 'Panama',
            value: 1574
        },
        {
            name: 'Malaysia',
            value: 347
        },
        {
            name: 'Namibia',
            value: 136
        },
        {
            name: 'South Korea',
            value: 1145
        },
        {
            name: 'Honduras',
            value: 921
        },
        {
            name: 'Iraq',
            value: 233
        },
        {
            name: 'Thailand',
            value: 198
        },
        {
            name: 'Mozambique',
            value: 125
        },
        {
            name: 'Turkey',
            value: 127
        },
        {
            name: 'Iceland',
            value: 958
        },
        {
            name: 'Kazakhstan',
            value: 36
        },
        {
            name: 'Norway',
            value: 312
        },
        {
            name: 'Syria',
            value: 484
        },
        {
            name: 'Zambia',
            value: 118
        },
        {
            name: 'South Sudan',
            value: 132
        },
        {
            name: 'Egypt',
            value: 83
        },
        {
            name: 'Madagascar',
            value: 143
        },
        {
            name: 'North Korea',
            value: 681
        },
        {
            name: 'Denmark',
            value: 1885
        },
        {
            name: 'Greece',
            value: 589
        },
        {
            name: 'Botswana',
            value: 131
        },
        {
            name: 'Sudan',
            value: 43
        },
        {
            name: 'Croatia',
            value: 1233
        },
        {
            name: 'Bulgaria',
            value: 627
        },
        {
            name: 'El Salvador',
            value: 3282
        },
        {
            name: 'Belarus',
            value: 320
        },
        {
            name: 'Myanmar',
            value: 98
        },
        {
            name: 'Portugal',
            value: 700
        },
        {
            name: 'Switzerland',
            value: 1575
        },
        {
            name: 'The Bahamas',
            value: 6094
        },
        {
            name: 'Lithuania',
            value: 973
        },
        {
            name: 'Somalia',
            value: 97
        },
        {
            name: 'Chad',
            value: 47
        },
        {
            name: 'Ethiopia',
            value: 52
        },
        {
            name: 'Yemen',
            value: 108
        },
        {
            name: 'Morocco',
            value: 123
        },
        {
            name: 'Suriname',
            value: 353
        },
        {
            name: 'French Polynesia',
            value: 14110
        },
        {
            name: 'Nigeria',
            value: 59
        },
        {
            name: 'Uzbekistan',
            value: 125
        },
        {
            name: 'Afghanistan',
            value: 80
        },
        {
            name: 'Austria',
            value: 631
        },
        {
            name: 'Belize',
            value: 2061
        },
        {
            name: 'Israel',
            value: 2186
        },
        {
            name: 'Nepal',
            value: 328
        },
        {
            name: 'Uganda',
            value: 238
        },
        {
            name: 'Romania',
            value: 196
        },
        {
            name: 'Vietnam',
            value: 145
        },
        {
            name: 'Gabon',
            value: 171
        },
        {
            name: 'Mongolia',
            value: 28
        },
        {
            name: 'United Arab Emirates',
            value: 514
        },
        {
            name: 'Latvia',
            value: 675
        },
        {
            name: 'Belgium',
            value: 1354
        },
        {
            name: 'Hungary',
            value: 458
        },
        {
            name: 'Laos',
            value: 178
        },
        {
            name: 'Ireland',
            value: 581
        },
        {
            name: 'Central African Republic',
            value: 63
        },
        {
            name: 'Azerbaijan',
            value: 448
        },
        {
            name: 'Taiwan',
            value: 1147
        },
        {
            name: 'Dominican Republic',
            value: 745
        },
        {
            name: 'Solomon Islands',
            value: 1286
        },
        {
            name: 'Slovakia',
            value: 728
        },
        {
            name: 'Cameroon',
            value: 70
        },
        {
            name: 'Malawi',
            value: 340
        },
        {
            name: 'Vanuatu',
            value: 2543
        },
        {
            name: 'Mauritania',
            value: 29
        },
        {
            name: 'Niger',
            value: 24
        },
        {
            name: 'Liberia',
            value: 301
        },
        {
            name: 'Netherlands',
            value: 856
        },
        {
            name: 'Puerto Rico',
            value: 3237
        },
        {
            name: 'Tunisia',
            value: 187
        },
        {
            name: 'Fiji',
            value: 1532
        },
        {
            name: 'Jamaica',
            value: 2585
        },
        {
            name: 'Kyrgyzstan',
            value: 146
        },
        {
            name: 'Republic of the Congo',
            value: 79
        },
        {
            name: 'Ivory Coast',
            value: 85
        },
        {
            name: 'Republic of Serbia',
            value: 336
        },
        {
            name: 'Turkmenistan',
            value: 55
        },
        {
            name: 'Mali',
            value: 20
        },
        {
            name: 'New Caledonia',
            value: 1368
        },
        {
            name: 'Bosnia and Herzegovina',
            value: 469
        },
        {
            name: 'Lesotho',
            value: 791
        },
        {
            name: 'Tajikistan',
            value: 170
        },
        {
            name: 'Antarctica',
            value: 2
        },
        {
            name: 'Burkina Faso',
            value: 84
        },
        {
            name: 'Georgia',
            value: 316
        },
        {
            name: 'Senegal',
            value: 104
        },
        {
            name: 'Kiribati',
            value: 23428
        },
        {
            name: 'Sri Lanka',
            value: 294
        },
        {
            name: 'Bangladesh',
            value: 138
        },
        {
            name: 'Estonia',
            value: 425
        },
        {
            name: 'Jordan',
            value: 203
        },
        {
            name: 'Cambodia',
            value: 91
        },
        {
            name: 'Guinea',
            value: 65
        },
        {
            name: 'Slovenia',
            value: 794
        },
        {
            name: 'Northern Cyprus',
            value: 1623
        },
        {
            name: 'Greenland',
            value: 7
        },
        {
            name: 'Marshall Islands',
            value: 82873
        },
        {
            name: 'Swaziland',
            value: 814
        },
        {
            name: 'Haiti',
            value: 508
        },
        {
            name: 'Seychelles',
            value: 30769
        },
        {
            name: 'Djibouti',
            value: 561
        },
        {
            name: 'Eritrea',
            value: 129
        },
        {
            name: 'Armenia',
            value: 390
        },
        {
            name: 'Cook Islands',
            value: 46610
        },
        {
            name: 'Ghana',
            value: 44
        },
        {
            name: 'Macedonia',
            value: 393
        },
        {
            name: 'Cape Verde',
            value: 2232
        },
        {
            name: 'Maldives',
            value: 30201
        },
        {
            name: 'Singapore',
            value: 12690
        },
        {
            name: 'Guinea Bissau',
            value: 284
        },
        {
            name: 'Lebanon',
            value: 782
        },
        {
            name: 'Sierra Leone',
            value: 112
        },
        {
            name: 'Togo',
            value: 147
        },
        {
            name: 'Turks and Caicos Islands',
            value: 8439
        },
        {
            name: 'Burundi',
            value: 273
        },
        {
            name: 'Equatorial Guinea',
            value: 250
        },
        {
            name: 'Falkland Islands',
            value: 575
        },
        {
            name: 'Kuwait',
            value: 393
        },
        {
            name: 'Moldova',
            value: 213
        },
        {
            name: 'Rwanda',
            value: 284
        },
        {
            name: 'Benin',
            value: 54
        },
        {
            name: 'East Timor',
            value: 403
        },
        {
            name: 'Kosovo',
            value: 551
        },
        {
            name: 'Micronesia',
            value: 8547
        },
        {
            name: 'Qatar',
            value: 518
        },
        {
            name: 'Saint Vincent and the Grenadines',
            value: 15424
        },
        {
            name: 'Tonga',
            value: 8368
        },
        {
            name: 'Western Sahara',
            value: 23
        },
        {
            name: 'Guam',
            value: 9191
        },
        {
            name: 'Mauritius',
            value: 2463
        },
        {
            name: 'Montenegro',
            value: 372
        },
        {
            name: 'Northern Mariana Islands',
            value: 10776
        },
        {
            name: 'Albania',
            value: 146
        },
        {
            name: 'Bahrain',
            value: 5263
        },
        {
            name: 'British Virgin Islands',
            value: 26490
        },
        {
            name: 'Comoros',
            value: 1790
        },
        {
            name: 'French Southern and Antarctic Lands',
            value: 522
        },
        {
            name: 'Samoa',
            value: 1418
        },
        {
            name: 'Spratly Islands',
            value: 800000
        },
        {
            name: 'Svalbard',
            value: 64
        },
        {
            name: 'Trinidad and Tobago',
            value: 780
        },
        {
            name: 'American Samoa',
            value: 13393
        },
        {
            name: 'Antigua and Barbuda',
            value: 6778
        },
        {
            name: 'Cayman Islands',
            value: 11364
        },
        {
            name: 'Grenada',
            value: 8721
        },
        {
            name: 'Palau',
            value: 6536
        },
        {
            name: 'Palestinian Territories',
            value: 500
        },
        {
            name: 'Anguilla',
            value: 21978
        },
        {
            name: 'Bhutan',
            value: 52
        },
        {
            name: 'Dominica',
            value: 2663
        },
        {
            name: 'Guernsey',
            value: 25608
        },
        {
            name: 'Hong Kong',
            value: 1864
        },
        {
            name: 'Luxembourg',
            value: 773
        },
        {
            name: 'Saint Kitts and Nevis',
            value: 7663
        },
        {
            name: 'Saint Lucia',
            value: 3300
        },
        {
            name: 'Saint Pierre and Miquelon',
            value: 8264
        },
        {
            name: 'São Tomé and Príncipe',
            value: 2075
        },
        {
            name: 'Virgin Islands of the U.S.',
            value: 5780
        },
        {
            name: 'Wallis and Futuna',
            value: 14085
        },
        {
            name: 'Aruba',
            value: 5556
        },
        {
            name: 'Barbados',
            value: 2326
        },
        {
            name: 'Bermuda',
            value: 18657
        },
        {
            name: 'British Indian Ocean Territory',
            value: 16667
        },
        {
            name: 'Brunei',
            value: 190
        },
        {
            name: 'Faroe Islands',
            value: 718
        },
        {
            name: 'Gambia',
            value: 99
        },
        {
            name: 'Gibraltar',
            value: 153846
        },
        {
            name: 'Jan Mayen',
            value: 2653
        },
        {
            name: 'Jersey',
            value: 8621
        },
        {
            name: 'Macau',
            value: 35461
        },
        {
            name: 'Malta',
            value: 3165
        },
        {
            name: 'Isle of Man',
            value: 1748
        },
        {
            name: 'Montserrat',
            value: 9804
        },
        {
            name: 'Nauru',
            value: 47170
        },
        {
            name: 'Niue',
            value: 3846
        },
        {
            name: 'Paracel Islands',
            value: 129032
        },
        {
            name: 'Saint Barthelemy',
            value: 40000
        },
        {
            name: 'Saint Helena, Ascension and Tristan da Cunha',
            value: 2538
        },
        {
            name: 'Saint Martin',
            value: 18382
        },
        {
            name: 'Sint Maarten',
            value: 29412
        },
        {
            name: 'Tuvalu',
            value: 39063
        },
        {
            name: 'Wake Island',
            value: 153846
        }
    ];

    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
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
                lineWidth: y === 0 ? 2 : undefined
            });
        }

        return data;
    };

    // Add flight route after initial animation
    const afterAnimate = e => {
        const chart = e.target.chart;

        if (!chart.get('flight-route')) {
            chart.addSeries({
                type: 'mapline',
                name: 'Flight route, Amsterdam - Los Angeles',
                animation: false,
                id: 'flight-route',
                data: [{
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [4.90, 53.38], // Amsterdam
                            [-118.24, 34.05] // Los Angeles
                        ]
                    },
                    color: '#313f77'
                }],
                lineWidth: 2,
                accessibility: {
                    exposeAsGroupOnly: true
                }
            }, false);
            chart.addSeries({
                type: 'mappoint',
                animation: false,
                data: [{
                    name: 'Amsterdam',
                    geometry: {
                        type: 'Point',
                        coordinates: [4.90, 53.38]
                    }
                }, {
                    name: 'LA',
                    geometry: {
                        type: 'Point',
                        coordinates: [-118.24, 34.05]
                    }
                }],
                color: '#313f77',
                accessibility: {
                    enabled: false
                }
            }, false);
            chart.redraw(false);
        }
    };


    Highcharts.getJSON(
        'https://code.highcharts.com/mapdata/custom/world.topo.json',
        topology => {

            const chart = Highcharts.mapChart('container', {
                chart: {
                    map: topology,
                    margin: [0, 0, 10, 0]
                },

                title: {
                    text: '',
                    floating: true,
                    align: 'left',
                    style: {
                        textOutline: '2px white'
                    }
                },

                subtitle: {
                    text: '',
                    floating: true,
                    y: 34,
                    align: 'left'
                },

                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                mapNavigation: {
                    enabled: true,
                    enableDoubleClickZoomTo: true,
                    enableMouseWheelZoom: false,
                    buttonOptions: mapbuttons,
                    buttons: {
                        zoomIn: {
                            x: 5,
                            y: 5
                        },
                        zoomOut: {
                            x: 5,
                            y: 31
                        }
                    }
                },

                mapView: {
                    maxZoom: 30,
                    projection: {
                        name: 'Orthographic',
                        rotation: [60, -30]
                    }
                },

                colorAxis: {
                    tickPixelInterval: 100,
                    minColor: '#BFCFAD',
                    maxColor: '#31784B',
                    max: 1000
                },

                tooltip: {
                    pointFormat: '{point.name}: {point.value}'
                },

                plotOptions: {
                    series: {
                        animation: {
                            duration: 750
                        },
                        clip: false
                    }
                },

                series: [{
                    name: 'Graticule',
                    id: 'graticule',
                    type: 'mapline',
                    data: getGraticule(),
                    nullColor: 'rgba(0, 0, 0, 0.05)',
                    accessibility: {
                        enabled: false
                    }
                }, {
                    data,
                    joinBy: 'name',
                    name: 'Airports per million km²',
                    dataLabels: {
                        enabled: false,
                        format: '{point.name}'
                    },
                    events: {
                        afterAnimate
                    },
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }],
                responsive: {
                    rules: [
                        // /up to 219
                        {
                            condition: {
                                // /up tp this
                                maxWidth: 219
                            },
                            chartOptions: {
                                chart: {
                                    height: 150
                                },
                                mapView: {
                                    zoom: 0.5
                                }
                            }
                        },
                        {
                            condition: {
                                minWidth: 220
                            },
                            chartOptions: {
                                chart: {
                                    height: 260
                                },
                                colorAxis: {
                                    visible: false
                                },
                                mapView: {
                                    zoom: 1.6
                                }
                            }
                        }
                    ]
                }
            });

            // Render a circle filled with a radial gradient behind the globe to
            // make it appear as the sea around the continents
            const renderSea = () => {
                let verb = 'animate';
                if (!chart.sea) {
                    chart.sea = chart.renderer
                        .circle()
                        .attr({
                            fill: {
                                radialGradient: {
                                    cx: 0.4,
                                    cy: 0.4,
                                    r: 1
                                },
                                stops: [
                                    [0, 'white'],
                                    [1, 'lightblue']
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
            renderSea();
            Highcharts.addEvent(chart, 'redraw', renderSea);

        }
    );
}

const charts = {
    spider: spider,
    temps: temps,
    clusters: clusters,
    projection: projection
};

charts[chartToShow]();