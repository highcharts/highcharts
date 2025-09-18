Highcharts.chart('chart', {

    dataTable: {
        columns: {
            Year: [
                2010, 2011, 2012, 2013, 2014, 2015,
                2016, 2017, 2018, 2019, 2020, 2021, 2022
            ],
            'Installation & Developers': [
                43934, 48656, 65165, 81827, 112143, 142383,
                171533, 165174, 155157, 161454, 154610, 168960, 171558
            ],
            Manufacturing: [
                24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050, 33099, 33473
            ],
            'Sales & Distribution': [
                11744, 30000, 16005, 19771, 20185, 24377,
                32147, 30912, 29243, 29213, 25663, 28978, 30618
            ],
            'Operations & Maintenance': [
                null, null, null, null, null, null, null,
                null, 11164, 11218, 10077, 12530, 16585
            ],
            Other: [
                21908, 5548, 8105, 11248, 8989, 11816, 18274,
                17300, 13053, 11906, 10073, 11471, 11648
            ]
        }
    },

    title: {
        text: 'U.S Solar Employment Growth',
        align: 'left'
    },

    subtitle: {
        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        align: 'left'
    },

    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },

    xAxis: {
        accessibility: {
            rangeDescription: 'Range: 2010 to 2022'
        }
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation & Developers',
        columnAssignment: [{
            key: 'x',
            columnName: 'Year'
        }, {
            key: 'y',
            columnName: 'Installation & Developers'
        }]
    }, {
        name: 'Manufacturing',
        columnAssignment: [{
            key: 'x',
            columnName: 'Year'
        }, {
            key: 'y',
            columnName: 'Manufacturing'
        }]
    }, {
        name: 'Sales & Distribution',
        columnAssignment: [{
            key: 'x',
            columnName: 'Year'
        }, {
            key: 'y',
            columnName: 'Sales & Distribution'
        }]
    }, {
        name: 'Operations & Maintenance',
        columnAssignment: [{
            key: 'x',
            columnName: 'Year'
        }, {
            key: 'y',
            columnName: 'Operations & Maintenance'
        }]
    }, {
        name: 'Other',
        columnAssignment: [{
            key: 'x',
            columnName: 'Year'
        }, {
            key: 'y',
            columnName: 'Other'
        }]
    }],
    exporting: {
        menuItemDefinitions: {
            viewData: {
                onclick: function () {
                    if (!this.grid) {
                        createGrid(this);
                    } else {
                        this.grid.container.classList.toggle('hide');
                    }
                    const isGridHidden = this.grid.container
                        .classList.contains(
                            'hide'
                        );
                    const viewDataElement = this.exporting.divElements[2];
                    viewDataElement.innerText =
                        `${isGridHidden ? 'Show' : 'Hide'} data table`;
                }
            }
        },
        buttons: {
            contextButton: {
                menuItems: ['viewFullscreen', 'printChart', 'viewData']
            }
        }
    },

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

function createGrid(chart) {
    const gridElement = document.createElement('div');
    gridElement.id = 'grid';
    document.getElementById('container').appendChild(gridElement);
    chart.grid = Grid.grid('grid', {
        dataTable: chart.dataTable,
        rendering: {
            columns: {
                resizing: {
                    mode: 'mixed'
                }
            },
            theme: 'hcg-theme-default theme-custom'
        },
        columnDefaults: {
            cells: {
                // Format numbers to mimic the chart tooltip
                // Uses Highcharts template engine to add commas on thousands
                format: '{value:,.0f}'
            }
        },
        columns: [
            {
                id: 'Year',
                name: 'Year',
                // 100px width for Year column
                width: 100,
                cells: {
                    // We do not want commas on the Year column
                    format: '{value}'
                }
            }
        ]
    });
}
