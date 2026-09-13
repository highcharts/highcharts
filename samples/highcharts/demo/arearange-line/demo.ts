(async () => {

    const csv = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@180fb2be6b/samples/data/who-height-for-age.csv'
    ).then(response => response.text());

    const dataTable = new Highcharts.Data({ csv })
        .getDataTable();

    Highcharts.chart('container', {

        dataTable,

        chart: {
            zooming: {
                type: 'x'
            }
        },

        title: {
            text: 'Expected Healthy Growth for Boys and Girls',
            align: 'left'
        },

        subtitle: {
            text: 'Ranges showing ± 2 standard deviations. Source: ' +
                '<a href="https://www.who.int/tools/child-growth-standards/standards/length-height-for-age"' +
                'target="_blank">WHO</a>.',
            align: 'left'
        },

        xAxis: {
            labels: {
                // Subtract 0 to turn '01' into 1
                format: '{subtract (value:%y) 0} years'
            },
            minPadding: 0,
            type: 'datetime'
        },

        yAxis: {
            lineWidth: 1,
            labels: {
                format: '{value} cm'
            },
            title: {
                text: 'Expected Height'
            }
        },

        tooltip: {
            crosshairs: true,
            headerFormat: `<table>
                <caption>Age {subtract (point.x:%y) 0}
                    years{#if (lt (point.x:%y) 6)},
                    {subtract (point.x:%m) 1} months
                {/if}</caption>`,
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
            valueSuffix: ' cm'
        },

        plotOptions: {
            series: {
                dataMapping: {
                    x: 'ageMonths'
                },
                pointIntervalUnit: 'month',
                pointStart: '2000-01-01',
                relativeXValue: true
            },
            line: {
                lineWidth: 3,
                tooltip: {
                    pointFormat: `<tr>
                        <th>
                            <svg width="20" height="10">
                            <path d="M 5 5 L 13 5" stroke="{series.color}"
                                stroke-width="5"
                                stroke-linecap="round" />
                            </svg>
                            {series.name}
                        </th>
                        <td>{point.y}</td>
                    </tr>`
                }
            },
            arearange: {
                fillOpacity: 0.3,
                lineWidth: 0,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
                states: {
                    hover: {
                        lineWidth: 0
                    }
                },
                tooltip: {
                    pointFormat: `<tr class="standard-deviation-row">
                        <th>± 2 SD</th>
                        <td>{point.low} - {point.high}</td>
                    </tr>`
                }
            }
        },

        series: [{
            name: 'Boys median',
            dataMapping: {
                y: 'boysMedian'
            },
            zIndex: 1
        }, {
            name: 'Boys ± 2 SD',
            dataMapping: {
                low: 'boysLow',
                high: 'boysHigh'
            },
            type: 'arearange',
            color: 'var(--highcharts-color-0)',
            zIndex: 0
        }, {
            name: 'Girls median',
            dataMapping: {
                y: 'girlsMedian'
            },
            color: '#fa4b42',
            zIndex: 1
        }, {
            name: 'Girls ± 2 SD',
            dataMapping: {
                low: 'girlsLow',
                high: 'girlsHigh'
            },
            type: 'arearange',
            color: '#fa4b42',
            zIndex: 0
        }],

        exporting: {
            csv: {
                dateFormat: '%y-%m'
            }
        }
    });
})();