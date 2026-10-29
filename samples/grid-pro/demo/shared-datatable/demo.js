const dataTable = new Grid.DataTable({
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
});

Highcharts.chart('chart', {
    dataTable,
    title: {
        text: 'U.S. Solar Employment Growth'
    },
    yAxis: {
        title: {
            text: 'Number of Employees'
        }
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },
    series: dataTable.getColumnIds()
        .filter(id => id !== 'Year')
        .map(y => ({
            dataMapping: { y }
        }))
});

Grid.grid('grid', {
    gridKey: 'YOUR-GRID-KEY-HERE',
    data: {
        dataTable
    },
    columnDefaults: {
        cells: {
            format: '{#if (ne value null)}{value:,.f}{else}-{/if}',
            editMode: {
                enabled: true,
                validationRules: ['notEmpty', 'number']
            }
        }
    },
    columns: [{
        id: 'Year',
        width: 80,
        cells: {
            format: '{value:.f}',
            editMode: {
                enabled: false
            }
        }
    }]
});
