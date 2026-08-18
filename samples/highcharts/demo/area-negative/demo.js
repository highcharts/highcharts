const dataTable = new Highcharts.Data({
    csv: document.getElementById('csv').innerText
}).getDataTable();

const imports = dataTable.getColumn('Imports'),
    exports = dataTable.getColumn('Exports');

dataTable.setColumns({
    'Trade Balance': exports.map((x, i) => x + imports[i])
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
    tooltip: {
        shared: true,
        valuePrefix: 'NOK ',
        valueSuffix: ' M'
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
        dataMapping: {
            y: 'Exports'
        }
    }, {
        dataMapping: {
            y: 'Imports'
        }
    }, {
        dataMapping: {
            y: 'Trade Balance'
        }
    }],
    exporting: {
        csv: {
            dateFormat: '%b %Y'
        }
    }
});
