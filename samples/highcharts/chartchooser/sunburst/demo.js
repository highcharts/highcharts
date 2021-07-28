var colors = Highcharts.getOptions().colors,
    categories = ['America', 'Asia', 'Europe', 'Other'],
    data = [
        {
            y: 160,
            color: colors[5],
            drilldown: {
                name: categories[0],
                categories: ['US', 'CA', 'BR'],
                data: [151, 8, 1]
            }
        },
        {
            y: 61,
            color: colors[0],
            drilldown: {
                name: categories[1],
                categories: ['RU', 'JP', 'OTH'],
                data: [49, 9, 3]
            }
        },
        {
            y: 18,
            color: colors[2],
            drilldown: {
                name: categories[2],
                categories: [
                    'IT',
                    'FR',
                    'GR',
                    'OTH'
                ],
                data: [5, 4, 3, 6]
            }
        },
        {
            y: 2,
            color: colors[3],
            drilldown: {
                name: categories[3],
                categories: ['Other'],
                data: [2]
            }
        }
    ],
    categoryData = [],
    foodData = [],
    i,
    j,
    dataLen = data.length,
    drillDataLen,
    brightness;

// Build the data arrays
for (i = 0; i < dataLen; i += 1) {
    // add browser data
    categoryData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
    });

    // add version data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
        brightness = 0.2 - j / drillDataLen / 5;
        foodData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(data[i].color).brighten(brightness).get()
        });
    }
}

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Visitors to the International Space Station by Country'
    },
    accessibility: {
        typeDescription: 'Pie chart with 2 pies. The inner pie represents continents, and the outer pie represents the countries within the continents.',
        point: {
            valueSuffix: ' visitors'
        }
    },
    subtitle: {
        text:
      'Source: <a href="https://www.nasa.gov/feature/visitors-to-the-station-by-country/">NASA</a>'
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'Visitors from <b>{point.name}</b> represent <b>{point.percentage:.0f}%</b>'
    },
    series: [
        {
            name: 'Continents',
            data: categoryData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            }
        },
        {
            name: 'Countries',
            data: foodData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ?
                        '<b>' + this.point.name + ':</b> ' + this.y :
                        null;
                }
            }
        }
    ],
    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [
                        {},
                        {
                            id: 'versions',
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }
            }
        ]
    }
});
