import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import GoogleSheetsStore from '../../../../code/es-modules/Data/Stores/GoogleSheetsStore.js';
import GroupModifier from '../../../../code/es-modules/Data/Modifiers/GroupModifier.js';

import ChainModifier from '../../../../code/es-modules/Data/Modifiers/ChainModifier.js';
import RangeModifier from '../../../../code/es-modules/Data/Modifiers/RangeModifier.js';

import DataSeriesConverter from '../../../../code/es-modules/Data/DataSeriesConverter.js';

let dataSeriesConverter, modifiedDataSeriesConverter;

const chart1 = Highcharts.chart('chart1', {
    title: {
        text: 'All states'
    },
    subtitle: {
        text: 'Before modification'
    }
});

const chart2 = Highcharts.chart('chart2', {
    title: {
        text: 'States where Trump had a negative margin'
    },
    subtitle: {
        text: 'After modification'
    }
});

Highcharts.chart('chart3', {
    title: {
        text: 'All states'
    },
    subtitle: {
        text: 'Create datatable from series'
    },
    series: [{
        data: [1, 2, 3]
    }, {
        keys: ['y', 'x'],
        data: [
            [4, 5],
            [7, 1],
            [5, 0]
        ]
    }, {
        data: [{
            x: 0,
            y: 4
        }, {
            x: 3,
            y: 10
        }, {
            x: 5,
            y: 8
        }]
    }]
}, function (chart) {
    // Create new dataSeriesConverter.
    const dataSeriesConverter = new DataSeriesConverter();

    // Save series data in the dataSeriesConverter dataTable.
    dataSeriesConverter.updateDataTable(chart.series);

    console.group('LINE series:');

    // Log the series data.
    const seriesId = chart.series[0].id;
    console.log('series[0] data: ', dataSeriesConverter.getSeriesData(seriesId));

    // Log all series data.
    console.log('all series data: ', dataSeriesConverter.getAllSeriesData());

    // Show dataSeriesConverter dataTable.
    console.log('dataTable: ', dataSeriesConverter.table);
    console.groupEnd();
});

Highcharts.stockChart('chart4', {
    title: {
        text: 'All states'
    },
    subtitle: {
        text: 'Create datatable from series'
    },
    series: [{
        type: 'ohlc',
        name: 'AAPL',
        data: [
            [1541514600000, 201.92, 204.72, 201.69, 203.77],
            [1541601000000, 205.97, 210.06, 204.13, 209.95],
            [1541687400000, 209.98, 210.12, 206.75, 208.49],
            [1541773800000, 205.55, 206.01, 202.25, 204.47],
            [1542033000000, 199, 199.85, 193.79, 194.17]
        ]
    }]
}, function (chart) {
    const dataSeriesConverter = new DataSeriesConverter();

    // Save series data in the dataSeriesConverter dataTable.
    dataSeriesConverter.updateDataTable(chart.series);

    console.group('OHLC series:');

    // Log the series data.
    const seriesId = chart.series[0].id;
    console.log('series[0] data: ', dataSeriesConverter.getSeriesData(seriesId));

    // Log all series data.
    console.log('all series data: ', dataSeriesConverter.getAllSeriesData());

    // Show dataSeriesConverter dataTable.
    console.log('dataTable: ', dataSeriesConverter.table);
    console.groupEnd();
});

const store = new GoogleSheetsStore(undefined, {
    googleSpreadsheetKey: '14632VxDAT-TAL06ICnoLsV_JyvjEBXdVY-J34br5iXY'
    // startColumn: 1,
    // endColumn: 8,
    // startRow: 0,
    // endRow: 52
});

const modifierChain = new ChainModifier();
const groupModifier = new GroupModifier({ groupColumn: 'Margin  (Trump)' });
const rangeModifier = new RangeModifier({ ranges: [{ column: 'value', maxValue: 0, minValue: -999 }] });

modifierChain.add(groupModifier);
modifierChain.add(rangeModifier);

store.on('load', e => console.log('load', e));

const modiferToUse = modifierChain;

store.on('afterLoad', e => {
    // Write the unmodified margins
    document.getElementById('datastore-before')
        .innerHTML = e.table.getAllRows().map(row => row.getCell('Margin  (Trump)')).join('\n');

    // Do the modification
    modiferToUse.execute(e.table);

    // convert data to series
    dataSeriesConverter = new DataSeriesConverter(e.table);

    chart1.update({
        series: dataSeriesConverter.getAllSeriesData()
    }, true, true, true);
});

modiferToUse.on('afterExecute', e => {
    // Write the modified margins
    document.getElementById('datastore-after')
        .innerHTML = e.table.getAllRows().map(row => row.getCell('value')).join('\n');

    // convert modified data to series
    modifiedDataSeriesConverter = new DataSeriesConverter(e.table);

    chart2.update({
        series: modifiedDataSeriesConverter.getAllSeriesData()
    }, true, true, true);
});

store.on('loadError', e => console.log(e));

store.load();

// demo - data module
Highcharts.chart('chart5', {
    title: {
        text: 'Data module - google spreadsheet'
    },
    data: {
        googleSpreadsheetKey: '0AoIaUO7wH1HwdENPcGVEVkxfUDJkMmFBcXMzOVVPdHc'
    }
});

// demo - data module - HTML table
Highcharts.chart('chart6', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Data module - HTML table'
    },
    data: {
        table: 'datatable',
        decimalPoint: ','
    }
});