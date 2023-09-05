const colors = Highcharts.getOptions().colors,
    categories = [
        'Chrome',
        'Safari',
        'Edge',
        'Firefox',
        'Other'
    ],
    data = [
        {
            y: 61.04,
            color: colors[2],
            drilldown: {
                name: 'Chrome',
                categories: [
                    'Chrome v97.0',
                    'Chrome v96.0',
                    'Chrome v95.0',
                    'Chrome v94.0',
                    'Chrome v93.0',
                    'Chrome v92.0',
                    'Chrome v91.0',
                    'Chrome v90.0',
                    'Chrome v89.0',
                    'Chrome v88.0',
                    'Chrome v87.0',
                    'Chrome v86.0',
                    'Chrome v85.0',
                    'Chrome v84.0',
                    'Chrome v83.0',
                    'Chrome v81.0',
                    'Chrome v89.0',
                    'Chrome v79.0',
                    'Chrome v78.0',
                    'Chrome v76.0',
                    'Chrome v75.0',
                    'Chrome v72.0',
                    'Chrome v70.0',
                    'Chrome v69.0',
                    'Chrome v56.0',
                    'Chrome v49.0'
                ],
                data: [
                    36.89,
                    18.16,
                    0.54,
                    0.7,
                    0.8,
                    0.41,
                    0.31,
                    0.13,
                    0.14,
                    0.1,
                    0.35,
                    0.17,
                    0.18,
                    0.17,
                    0.21,
                    0.1,
                    0.16,
                    0.43,
                    0.11,
                    0.16,
                    0.15,
                    0.14,
                    0.11,
                    0.13,
                    0.12
                ]
            }
        },
        {
            y: 9.47,
            color: colors[3],
            drilldown: {
                name: 'Safari',
                categories: [
                    'Safari v15.3',
                    'Safari v15.2',
                    'Safari v15.1',
                    'Safari v15.0',
                    'Safari v14.1',
                    'Safari v14.0',
                    'Safari v13.1',
                    'Safari v13.0',
                    'Safari v12.1'
                ],
                data: [
                    0.1,
                    2.01,
                    2.29,
                    0.49,
                    2.48,
                    0.64,
                    1.17,
                    0.13,
                    0.16
                ]
            }
        },
        {
            y: 9.32,
            color: colors[5],
            drilldown: {
                name: 'Edge',
                categories: [
                    'Edge v97',
                    'Edge v96',
                    'Edge v95'
                ],
                data: [
                    6.62,
                    2.55,
                    0.15
                ]
            }
        },
        {
            y: 8.15,
            color: colors[1],
            drilldown: {
                name: 'Firefox',
                categories: [
                    'Firefox v96.0',
                    'Firefox v95.0',
                    'Firefox v94.0',
                    'Firefox v91.0',
                    'Firefox v78.0',
                    'Firefox v52.0'
                ],
                data: [
                    4.17,
                    3.33,
                    0.11,
                    0.23,
                    0.16,
                    0.15
                ]
            }
        },
        {
            y: 11.02,
            color: colors[6],
            drilldown: {
                name: 'Other',
                categories: [
                    'Other'
                ],
                data: [
                    11.02
                ]
            }
        }
    ],
    browserData = [],
    versionsData = [],
    dataLen = data.length;

let i,
    j,
    drillDataLen,
    brightness;


// Build the data arrays
for (i = 0; i < dataLen; i += 1) {

    // add browser data
    browserData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color
    });

    // add version data
    drillDataLen = data[i].drilldown.data.length;
    for (j = 0; j < drillDataLen; j += 1) {
        const name = data[i].drilldown.categories[j];
        brightness = 0.2 - (j / drillDataLen) / 5;
        versionsData.push({
            name,
            y: data[i].drilldown.data[j],
            color: Highcharts.color(data[i].color).brighten(brightness).get(),
            custom: {
                version: name.split(' ')[1] || name.split(' ')[0]
            }
        });
    }
}

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Browser market share, January, 2022',
        align: 'left'
    },
    subtitle: {
        text: 'Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
        align: 'left'
    },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },
    tooltip: {
        valueSuffix: '%'
    },
    series: [{
        name: 'Browsers',
        data: browserData,
        size: '45%',
        dataLabels: {
            color: '#ffffff',
            distance: '-50%'
        }
    }, {
        name: 'Versions',
        data: versionsData,
        size: '80%',
        innerSize: '60%',
        dataLabels: {
            format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}%</span>',
            filter: {
                property: 'y',
                operator: '>',
                value: 1
            },
            style: {
                fontWeight: 'normal'
            }
        },
        id: 'versions'
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                }, {
                    id: 'versions',
                    dataLabels: {
                        distance: 10,
                        format: '{point.custom.version}',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 2
                        }
                    }
                }]
            }
        }]
    }
});
