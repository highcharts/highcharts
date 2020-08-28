import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import GoogleSheetsStore from '../../../../code/es-modules/Data/Stores/GoogleSheetsStore.js';
import GroupDataModifier from '../../../../code/es-modules/Data/Modifiers/GroupDataModifier.js';

import ChainDataModifier from '../../../../code/es-modules/Data/Modifiers/ChainDataModifier.js';
import RangeDataModifier from '../../../../code/es-modules/Data/Modifiers/RangeDataModifier.js';

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
    const dataSeriesConverter = new DataSeriesConverter(undefined, {
        columnMap: {
            y: 'customY'
        }
    });
    const table = dataSeriesConverter.setDataTable(chart.series);
    console.log('table from LINE series -> ', table);
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
    const dataSeriesConverter = new DataSeriesConverter(undefined, {
        columnMap: {
            open: 'customOpen'
        }
    });
    const table = dataSeriesConverter.setDataTable(chart.series);
    console.log('table from OHLC series -> ', table);
});

const store = new GoogleSheetsStore(undefined, {
    googleSpreadsheetKey: '14632VxDAT-TAL06ICnoLsV_JyvjEBXdVY-J34br5iXY'
    // startColumn: 1,
    // endColumn: 8,
    // startRow: 0,
    // endRow: 52
});

const modifierChain = new ChainDataModifier();
const groupModifier = new GroupDataModifier({ groupColumn: 'Margin  (Trump)' });
const rangeModifier = new RangeDataModifier({ ranges: [{ column: 3, maxValue: 0, minValue: -100 }] });

modifierChain.add(groupModifier);
modifierChain.add(rangeModifier);

store.on('load', e => console.log('load', e));

const modiferToUse = modifierChain;

store.on('afterLoad', e => {
    // Write the unmodified margins
    document.getElementById('datastore-before')
        .innerHTML = e.table.getAllRows().map(row => row.getColumn('Margin  (Trump)')).join('\n');

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
        .innerHTML = e.table.getAllRows().map(row => row.getColumn(3)).join('\n');

    // convert modified data to series
    modifiedDataSeriesConverter = new DataSeriesConverter(e.table);

    chart2.update({
        series: modifiedDataSeriesConverter.getAllSeriesData()
    }, true, true, true);
});

store.on('loadError', e => console.log(e));

store.load();
