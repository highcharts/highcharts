function generateChart(countries, data, getData, locations) {
    const chart =  Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        // Custom option for templates
        countries,
        title: {
            text: 'Summer Olympics 2024 - Top 5 countries by Gold medals',
            align: 'left'
        },
        subtitle: {
            text: 'Comparing to results from Summer Olympics 2020 - Source: ' +
                '<a href="https://olympics.com/en/olympic-games/paris-2024/medals"' +
                'target="_blank">Olympics</a>',
            align: 'left'
        },
        plotOptions: {
            series: {
                grouping: false,
                borderWidth: 0
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            shared: true,
            headerFormat: '<span style="font-size: 15px">' +
                '{series.chart.options.countries.(point.key).name}' +
                '</span><br/>',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '{series.name}: <b>{point.y} medals</b><br/>'
        },
        xAxis: {
            type: 'category',
            accessibility: {
                description: 'Countries'
            },
            max: 4,
            labels: {
                useHTML: true,
                animate: true,
                format: '{chart.options.countries.(value).ucCode}<br>' +
                    '<span class="f32">' +
                    '<span style="display:inline-block;height:32px;' +
                    'vertical-align:text-top;" class="flag {value}">' +
                    '</span></span>',
                style: {
                    textAlign: 'center'
                }
            }
        },
        yAxis: [{
            title: {
                text: 'Gold medals'
            },
            showFirstLabel: false
        }],
        series: [{
            color: 'rgba(158, 159, 163, 0.5)',
            pointPlacement: -0.2,
            linkedTo: 'main',
            data: data[2020].slice(),
            name: '2020'
        }, {
            name: '2024',
            id: 'main',
            dataSorting: {
                enabled: true,
                matchByName: true
            },
            dataLabels: [{
                enabled: true,
                inside: true,
                style: {
                    fontSize: '16px'
                }
            }],
            data: getData(data[2024]).slice()
        }],
        exporting: {
            allowHTML: true
        }
    });

    locations.forEach(location => {
        const btn = document.getElementById(location.year);

        btn.addEventListener('click', () => {

            document.querySelectorAll('.buttons button.active')
                .forEach(active => {
                    active.className = '';
                });
            btn.className = 'active';

            chart.update({
                title: {
                    text: 'Summer Olympics ' + location.year +
                        ' - Top 5 countries by Gold medals'
                },
                subtitle: {
                    text: 'Comparing to results from Summer Olympics ' +
                        (location.year - 4) +
                        ' - Source: <a href="https://olympics.com/en/olympic-games/' +
                        (location.city.toLowerCase()) +
                        '-' + (location.year) +
                        '/medals" target="_blank">Olympics</a>'
                },
                series: [{
                    name: location.year - 4,
                    data: data[location.year - 4].slice()
                }, {
                    name: location.year,
                    data: getData(data[location.year]).slice()
                }]
            }, true, false, {
                duration: 800
            });
        });
    });
}

const data = {
    2024: [
        ['kr', 13],
        ['jp', 20],
        ['au', 18],
        ['de', 12],
        ['ru',  0],
        ['cn', 40],
        ['gb', 14],
        ['us', 40],
        ['fr', 16]
    ],
    2020: [
        ['kr', 6],
        ['jp', 27],
        ['au', 17],
        ['de', 10],
        ['ru', 20],
        ['cn', 38],
        ['gb', 22],
        ['us', 39],
        ['fr', 10]
    ],
    2016: [
        ['kr', 9],
        ['jp', 12],
        ['au', 8],
        ['de', 17],
        ['ru', 19],
        ['cn', 26],
        ['gb', 27],
        ['us', 46],
        ['fr', 10]
    ],
    2012: [
        ['kr', 13],
        ['jp', 7],
        ['au', 8],
        ['de', 11],
        ['ru', 20],
        ['cn', 38],
        ['gb', 29],
        ['us', 47],
        ['fr', 11]
    ],
    2008: [
        ['kr', 13],
        ['jp', 9],
        ['au', 14],
        ['de', 16],
        ['ru', 24],
        ['cn', 48],
        ['gb', 19],
        ['us', 36],
        ['fr', 7]
    ],
    2004: [
        ['kr', 9],
        ['jp', 17],
        ['au', 18],
        ['de', 13],
        ['ru', 29],
        ['cn', 33],
        ['gb', 9],
        ['us', 37],
        ['fr', 11]
    ],
    2000: [
        ['kr', 8],
        ['jp', 5],
        ['au', 16],
        ['de', 13],
        ['ru', 32],
        ['cn', 28],
        ['gb', 11],
        ['us', 37],
        ['fr', 13]
    ]
};

const countries = {
    kr: {
        name: 'South Korea',
        color: '#FE2371'
    },
    jp: {
        name: 'Japan',
        color: '#544FC5'
    },
    au: {
        name: 'Australia',
        color: '#2CAFFE'
    },
    de: {
        name: 'Germany',
        color: '#FE6A35'
    },
    ru: {
        name: 'Russia',
        color: '#6B8ABC'
    },
    cn: {
        name: 'China',
        color: '#1C74BD'
    },
    gb: {
        name: 'Great Britain',
        color: '#00A6A6'
    },
    us: {
        name: 'United States',
        color: '#D568FB'
    },
    fr: {
        name: 'France',
        color: '#D10816'
    }
};

// Add upper case country code
for (const [key, value] of Object.entries(countries)) {
    value.ucCode = key.toUpperCase();
}


const getData = data => data.map(point => ({
    name: point[0],
    y: point[1],
    color: countries[point[0]].color
}));

const locations = [
    {
        city: 'Paris',
        year: 2024
    }, {
        city: 'Tokyo',
        year: 2020
    }, {
        city: 'Rio',
        year: 2016
    }, {
        city: 'London',
        year: 2012
    }, {
        city: 'Beijing',
        year: 2008
    }, {
        city: 'Athens',
        year: 2004
    }
];

generateChart(countries, data, getData, locations);
