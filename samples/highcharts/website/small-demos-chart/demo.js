const params = (new URL(document.location)).search;

const pArray = params.split('&');


let chartStr = '';
let chartToShow = 'dependencyWheel';

pArray.forEach(function (element) {
    if (element.indexOf('charts=') !== -1) {
        chartStr = element;
    }
});

const chartArray = chartStr.split('=');
if (chartArray.length > 1) {
    chartToShow = chartArray[1];
}

// dependency wheel
function dependencyWheel() {
    Highcharts.chart('container', {
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            dependencywheel: {
                dataLabels: {
                    enabled: true
                },
                size: '90%'
            }
        },
        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
            }
        },
        series: [{
            keys: ['from', 'to', 'weight'],
            data: [

                ['Canada', 'France', 5],
                ['Canada', 'England', 1],
                ['Mexico', 'France', 2],
                ['Mexico', 'England', 2],
                ['USA', 'France', 1],
                ['USA', 'England', 5],

                ['France', 'Angola', 1],
                ['France', 'South Africa', 1],

                ['England', 'Angola', 1],
                ['England', 'South Africa', 7],
                ['South Africa', 'Japan', 3],
                ['Angola', 'Japan', 3]

            ],
            type: 'dependencywheel',
            name: 'Dependency wheel series',
            dataLabels: {
                color: '#333',
                textPath: {
                    enabled: true
                },
                distance: 10
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    // up tp this
                    maxWidth: 219
                },
                chartOptions: {
                    chart: {
                        height: 150,
                        margin: 10
                    }
                }
            }, {
                condition: {
                    minWidth: 220
                },
                chartOptions: {
                    chart: {
                        height: 260,
                        margin: 10
                    }
                }
            }
            ]
        }
    });
}

function area() {
    Highcharts.chart('container', {
        chart: {
            type: 'area'
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
        accessibility: {
            point: {
                valueDescriptionFormat: '{index}. {point.category}, {point.y:,.0f} millions, {point.percentage:.1f}%.'
            }
        },
        xAxis: {
            categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            labels: {
                format: '{value}%'
            },
            title: {
                enabled: false
            },
            offset: -20
        },
        tooltip: {
            outside: true,
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
            split: true
        },
        plotOptions: {
            area: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff'
                }
            }
        },
        series: [{
            name: 'Asia',
            data: [502, 635, 809, 947, 1402, 3634, 5268]
        }, {
            name: 'Africa',
            data: [106, 107, 111, 133, 221, 767, 1766]
        }, {
            name: 'Europe',
            data: [163, 203, 276, 408, 547, 729, 628]
        }, {
            name: 'America',
            data: [18, 31, 54, 156, 339, 818, 1201]
        }, {
            name: 'Oceania',
            data: [2, 2, 2, 6, 13, 30, 46]
        }],
        responsive: {
            rules: [{
                condition: {
                    // up tp this
                    maxWidth: 219
                },
                chartOptions: {
                    chart: {
                        height: 150,
                        margin: [0, 0, 0, 0]
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical'
                    },
                    xAxis: {
                        visible: false
                    },
                    yAxis: {
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
                        height: 260,
                        margin: [10, 5, 40, 30]
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical'
                    },
                    xAxis: {
                        visible: true
                    },
                    yAxis: {
                        visible: true
                    }
                }
            }
            ]
        }
    });
}

// /area range line
const ranges = [
        [1246406400000, 14.3, 27.7],
        [1246492800000, 14.5, 27.8],
        [1246579200000, 15.5, 29.6],
        [1246665600000, 16.7, 30.7],
        [1246752000000, 16.5, 25.0],
        [1246838400000, 17.8, 25.7],
        [1246924800000, 13.5, 24.8],
        [1247011200000, 10.5, 21.4],
        [1247097600000, 9.2, 23.8],
        [1247184000000, 11.6, 21.8],
        [1247270400000, 10.7, 23.7],
        [1247356800000, 11.0, 23.3],
        [1247443200000, 11.6, 23.7],
        [1247529600000, 11.8, 20.7],
        [1247616000000, 12.6, 22.4],
        [1247702400000, 13.6, 19.6],
        [1247788800000, 11.4, 22.6],
        [1247875200000, 13.2, 25.0],
        [1247961600000, 14.2, 21.6],
        [1248048000000, 13.1, 17.1],
        [1248134400000, 12.2, 15.5],
        [1248220800000, 12.0, 20.8],
        [1248307200000, 12.0, 17.1],
        [1248393600000, 12.7, 18.3],
        [1248480000000, 12.4, 19.4],
        [1248566400000, 12.6, 19.9],
        [1248652800000, 11.9, 20.2],
        [1248739200000, 11.0, 19.3],
        [1248825600000, 10.8, 17.8],
        [1248912000000, 11.8, 18.5],
        [1248998400000, 10.8, 16.1]
    ],
    averages = [
        [1246406400000, 21.5],
        [1246492800000, 22.1],
        [1246579200000, 23],
        [1246665600000, 23.8],
        [1246752000000, 21.4],
        [1246838400000, 21.3],
        [1246924800000, 18.3],
        [1247011200000, 15.4],
        [1247097600000, 16.4],
        [1247184000000, 17.7],
        [1247270400000, 17.5],
        [1247356800000, 17.6],
        [1247443200000, 17.7],
        [1247529600000, 16.8],
        [1247616000000, 17.7],
        [1247702400000, 16.3],
        [1247788800000, 17.8],
        [1247875200000, 18.1],
        [1247961600000, 17.2],
        [1248048000000, 14.4],
        [1248134400000, 13.7],
        [1248220800000, 15.7],
        [1248307200000, 14.6],
        [1248393600000, 15.3],
        [1248480000000, 15.3],
        [1248566400000, 15.8],
        [1248652800000, 15.2],
        [1248739200000, 14.8],
        [1248825600000, 14.4],
        [1248912000000, 15],
        [1248998400000, 13.6]
    ];

function range() {
    Highcharts.chart('container', {
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            visible: true,
            accessibility: {
                rangeDescription: 'Range: Jul 1st 2009 to Jul 31st 2009.'
            }
        },
        yAxis: {
            visible: true,
            title: {
                text: null
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°C'
        },
        series: [{
            name: 'Temperature',
            data: averages,
            zIndex: 1,
            marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            }
        }, {
            name: 'Range',
            data: ranges,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            color: Highcharts.getOptions().colors[0],
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    // /up tp this
                    maxWidth: 219
                },
                chartOptions: {
                    chart: {
                        height: 150,
                        margin: [0, 0, 0, 0]
                    },
                    xAxis: {
                        visible: false
                    },
                    yAxis: {
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
                        height: 260,
                        margin: [10, 0, 30, 30]
                    },
                    xAxis: {
                        visible: true
                    },
                    yAxis: {
                        visible: true
                    }
                }
            }
            ]
        }
    });
}

function bubble() {
    Highcharts.chart('container', {
        chart: {
            type: 'packedbubble'
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        title: {
            text: '',
            style: {
                fontSize: '12px'
            }
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
        },
        legend: {
            enabled: true,
            floating: true,
            itemDistance: 5,
            symbolPadding: 2,
            labelFormatter: function () {
                return this.options.id;
                // '{point.id}'
            }
        },
        plotOptions: {
            packedbubble: {
                minSize: '30%',
                maxSize: '200%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.02
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [{
            name: 'Europe',
            id: 'EU',
            data: [{
                name: 'Germany',
                value: 767.1
            }, {
                name: 'Croatia',
                value: 20.7
            },
            {
                name: 'Belgium',
                value: 97.2
            },
            {
                name: 'Czech Republic',
                value: 111.7
            },
            {
                name: 'Netherlands',
                value: 158.1
            },
            {
                name: 'Spain',
                value: 241.6
            },
            {
                name: 'Ukraine',
                value: 249.1
            },
            {
                name: 'Poland',
                value: 298.1
            },
            {
                name: 'France',
                value: 323.7
            },
            {
                name: 'Romania',
                value: 78.3
            },
            {
                name: 'United Kingdom',
                value: 415.4
            }, {
                name: 'Turkey',
                value: 353.2
            }, {
                name: 'Italy',
                value: 337.6
            },
            {
                name: 'Greece',
                value: 71.1
            },
            {
                name: 'Austria',
                value: 69.8
            },
            {
                name: 'Belarus',
                value: 67.7
            },
            {
                name: 'Serbia',
                value: 59.3
            },
            {
                name: 'Finland',
                value: 54.8
            },
            {
                name: 'Bulgaria',
                value: 51.2
            },
            {
                name: 'Portugal',
                value: 48.3
            },
            {
                name: 'Norway',
                value: 44.4
            },
            {
                name: 'Sweden',
                value: 44.3
            },
            {
                name: 'Hungary',
                value: 43.7
            },
            {
                name: 'Switzerland',
                value: 40.2
            },
            {
                name: 'Denmark',
                value: 40
            },
            {
                name: 'Slovakia',
                value: 34.7
            },
            {
                name: 'Ireland',
                value: 34.6
            },
            {
                name: 'Croatia',
                value: 20.7
            },
            {
                name: 'Estonia',
                value: 19.4
            },
            {
                name: 'Slovenia',
                value: 16.7
            },
            {
                name: 'Lithuania',
                value: 12.3
            },
            {
                name: 'Luxembourg',
                value: 10.4
            },
            {
                name: 'Macedonia',
                value: 9.5
            },
            {
                name: 'Moldova',
                value: 7.8
            },
            {
                name: 'Latvia',
                value: 7.5
            },
            {
                name: 'Cyprus',
                value: 7.2
            }]
        }, {
            name: 'Africa',
            id: 'AF',
            data: [{
                name: 'Senegal',
                value: 8.2
            },
            {
                name: 'Cameroon',
                value: 9.2
            },
            {
                name: 'Zimbabwe',
                value: 13.1
            },
            {
                name: 'Ghana',
                value: 14.1
            },
            {
                name: 'Kenya',
                value: 14.1
            },
            {
                name: 'Sudan',
                value: 17.3
            },
            {
                name: 'Tunisia',
                value: 24.3
            },
            {
                name: 'Angola',
                value: 25
            },
            {
                name: 'Libya',
                value: 50.6
            },
            {
                name: 'Ivory Coast',
                value: 7.3
            },
            {
                name: 'Morocco',
                value: 60.7
            },
            {
                name: 'Ethiopia',
                value: 8.9
            },
            {
                name: 'United Republic of Tanzania',
                value: 9.1
            },
            {
                name: 'Nigeria',
                value: 93.9
            },
            {
                name: 'South Africa',
                value: 392.7
            }, {
                name: 'Egypt',
                value: 225.1
            }, {
                name: 'Algeria',
                value: 141.5
            }]
        }, {
            name: 'Oceania',
            id: 'OC',
            data: [{
                name: 'Australia',
                value: 409.4
            },
            {
                name: 'New Zealand',
                value: 34.1
            },
            {
                name: 'Papua New Guinea',
                value: 7.1
            }]
        }, {
            name: 'North America',
            id: 'NA',
            data: [{
                name: 'Costa Rica',
                value: 7.6
            },
            {
                name: 'Honduras',
                value: 8.4
            },
            {
                name: 'Jamaica',
                value: 8.3
            },
            {
                name: 'Panama',
                value: 10.2
            },
            {
                name: 'Guatemala',
                value: 12
            },
            {
                name: 'Dominican Republic',
                value: 23.4
            },
            {
                name: 'Cuba',
                value: 30.2
            },
            {
                name: 'USA',
                value: 5334.5
            }, {
                name: 'Canada',
                value: 566
            }, {
                name: 'Mexico',
                value: 456.3
            }]
        }, {
            name: 'South America',
            id: 'SA',
            data: [{
                name: 'El Salvador',
                value: 7.2
            },
            {
                name: 'Uruguay',
                value: 8.1
            },
            {
                name: 'Bolivia',
                value: 17.8
            },
            {
                name: 'Trinidad and Tobago',
                value: 34
            },
            {
                name: 'Ecuador',
                value: 43
            },
            {
                name: 'Chile',
                value: 78.6
            },
            {
                name: 'Peru',
                value: 52
            },
            {
                name: 'Colombia',
                value: 74.1
            },
            {
                name: 'Brazil',
                value: 501.1
            }, {
                name: 'Argentina',
                value: 199
            },
            {
                name: 'Venezuela',
                value: 195.2
            }]
        }, {
            name: 'Asia',
            id: 'AS',
            data: [{
                name: 'Nepal',
                value: 6.5
            },
            {
                name: 'Georgia',
                value: 6.5
            },
            {
                name: 'Brunei Darussalam',
                value: 7.4
            },
            {
                name: 'Kyrgyzstan',
                value: 7.4
            },
            {
                name: 'Afghanistan',
                value: 7.9
            },
            {
                name: 'Myanmar',
                value: 9.1
            },
            {
                name: 'Mongolia',
                value: 14.7
            },
            {
                name: 'Sri Lanka',
                value: 16.6
            },
            {
                name: 'Bahrain',
                value: 20.5
            },
            {
                name: 'Yemen',
                value: 22.6
            },
            {
                name: 'Jordan',
                value: 22.3
            },
            {
                name: 'Lebanon',
                value: 21.1
            },
            {
                name: 'Azerbaijan',
                value: 31.7
            },
            {
                name: 'Singapore',
                value: 47.8
            },
            {
                name: 'Hong Kong',
                value: 49.9
            },
            {
                name: 'Syria',
                value: 52.7
            },
            {
                name: 'DPR Korea',
                value: 59.9
            },
            {
                name: 'Israel',
                value: 64.8
            },
            {
                name: 'Turkmenistan',
                value: 70.6
            },
            {
                name: 'Oman',
                value: 74.3
            },
            {
                name: 'Qatar',
                value: 88.8
            },
            {
                name: 'Philippines',
                value: 96.9
            },
            {
                name: 'Kuwait',
                value: 98.6
            },
            {
                name: 'Uzbekistan',
                value: 122.6
            },
            {
                name: 'Iraq',
                value: 139.9
            },
            {
                name: 'Pakistan',
                value: 158.1
            },
            {
                name: 'Vietnam',
                value: 190.2
            },
            {
                name: 'United Arab Emirates',
                value: 201.1
            },
            {
                name: 'Malaysia',
                value: 227.5
            },
            {
                name: 'Kazakhstan',
                value: 236.2
            },
            {
                name: 'Thailand',
                value: 272
            },
            {
                name: 'Taiwan',
                value: 276.7
            },
            {
                name: 'Indonesia',
                value: 453
            },
            {
                name: 'Saudi Arabia',
                value: 494.8
            },
            {
                name: 'Japan',
                value: 1278.9
            },
            {
                name: 'China',
                value: 10540.8
            },
            {
                name: 'India',
                value: 2341.9
            },
            {
                name: 'Russia',
                value: 1766.4
            },
            {
                name: 'Iran',
                value: 618.2
            },
            {
                name: 'Korea',
                value: 610.1
            }]
        }],
        responsive: {
            rules: [{
                condition: {
                    // /up tp this
                    maxWidth: 219
                },
                chartOptions: {
                    chart: {
                        height: 150,
                        margin: [0, 0, 0, 0]
                    },
                    legend: {
                        layout: 'horizontal'
                    }
                }
            },
            {
                condition: {
                    minWidth: 220
                },
                chartOptions: {
                    chart: {
                        height: 260,
                        margin: [0, 0, 0, 0]
                    },
                    legend: {
                        layout: 'horizontal'
                    },
                    xAxis: {
                        visible: true
                    },
                    yAxis: {
                        visible: true
                    }
                }
            }
            ]
        }
    });
}

const charts = {
    dependencyWheel: dependencyWheel,
    area: area,
    range: range,
    bubble: bubble
};


charts[chartToShow]();