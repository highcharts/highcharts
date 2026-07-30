const dataTable = new Highcharts.Data({
    csv: document.getElementById('csv').innerHTML
}).getDataTable();

const imports = dataTable.getColumn('Imports'),
    exports = dataTable.getColumn('Exports');

dataTable.setColumns({
    Balance: exports.map((x, i) => x + imports[i])
});

Highcharts.chart('container', {
    dataTable,
    chart: {
        type: 'area'
    },
    title: {
        text: 'Import, Export of goods in Norway (NOK million)'
    },
    subtitle: {
        text: 'Source: <a ' +
            'href="https://www.ssb.no/en/statbank/table/08792"' +
            ' target="_blank">SSB</a>'
    },
    xAxis: {
        type: 'datetime',
        lineWidth: 0
    },
    yAxis: {
        title: {
            text: 'MNOK'
        },
        plotLines: [{
            color: 'var(--highcharts-neutral-color-100, black)',
            value: 0,
            width: 2
        }]
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            dataMapping: {
                x: 'Month'
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Exports',
        dataMapping: {
            y: 'Exports'
        }
    }, {
        name: 'Imports',
        dataMapping: {
            y: 'Imports'
        }
    }, {
        name: 'Trade Balance',
        dataMapping: {
            y: 'Balance'
        }
    }]
});
