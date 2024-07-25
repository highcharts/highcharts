// Credentials
const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA';

/* Helper functions */
function sheetTitle(n = 1) {
    return {
        original: 'Original sheet #' + n,
        modified: 'Modified sheet #' + n
    };
}

/* Various 'beforeParse' functions */
function bfpNone(data) {
    return data;
}

function bfpModifyHeader(data) {
    data.forEach(col => {
        col[0] = col[0].toUpperCase();
    });
    // Header for the first column
    data[0][0] = '-';

    return data;
}

function bfpModifyData(data) {
    // Deprive everyone of their oranges
    for (let i = 1; i < data.length; i++) {
        data[i][2] = 0;
    }

    return data;
}

// Function to perform in 'beforeParse' of the modified sheet connector.
// The function is selected by the user in the dropdown in demo.html
let beforeParseSelector = 0;

// 'beforeParse' lookup. The order must reflect the dropdown in demo.html.
const beforeParseFunction = [bfpNone, bfpModifyHeader, bfpModifyData];


/* Create the Dashboard */
const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'conn-orig',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: googleApiKey,
                googleSpreadsheetKey: googleSpreadsheetKey
            }
        }, {
            id: 'conn-mod',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: googleApiKey,
                googleSpreadsheetKey: googleSpreadsheetKey,
                beforeParse: data =>
                    beforeParseFunction[beforeParseSelector](data)
            }
        }]
    },
    components: [{
        // Original sheet
        type: 'DataGrid',
        renderTo: 'orig-sheet-cell',
        connector: {
            id: 'conn-orig'
        },
        title: sheetTitle().original,
        dataGridOptions: {
            editable: false
        }
    }, {
        // Modified sheet
        type: 'DataGrid',
        renderTo: 'mod-sheet-cell',
        connector: {
            id: 'conn-mod'
        },
        title: sheetTitle().modified,
        dataGridOptions: {
            editable: false
        }
    }]
});


// Event handlers for configuration choices (dropdowns)
const worksheetSelect = document.getElementById('worksheet-select');
const beforeParseSelect = document.getElementById('before-parse-select');
const dataModifierSelect = document.getElementById('data-modifier-select');

//
// Worksheet selection processing
//
worksheetSelect.addEventListener('input', async e => {
    // The worksheet selection has changed
    const worksheet = Number(e.target.value) + 1;

    // Update the original sheet component
    let connector = board.dataPool.connectors['conn-orig'];
    connector.options.worksheet = worksheet;
    await connector.load();

    let comp = board.getComponentByCellId('orig-sheet-cell');
    const title = sheetTitle(worksheet);
    await comp.update({
        title: {
            text: title.original
        }
    });

    // Update the modified sheet component
    connector = board.dataPool.connectors['conn-mod'];
    connector.options.worksheet = worksheet;
    await connector.load();

    comp = board.getComponentByCellId('mod-sheet-cell');
    await comp.update({
        title: {
            text: title.modified
        }
    });
});


//
// 'beforeParse' processing
//
beforeParseSelect.addEventListener('input', async e => {
    const idx = e.target.value;
    if (idx >= beforeParseFunction.length) {
        return;
    }

    // Used in the 'beforeParse' callback of the modified sheet connector
    beforeParseSelector = idx;

    // Update the modified sheet component
    await board.dataPool.connectors['conn-mod'].load();

    // Re-apply data modifier
    await applyDataModifier(dataModifierSelect.value);
});


//
// Data modifier processing
//
const MathModifier = Dashboards.DataModifier.types.Math;
const SortModifier = Dashboards.DataModifier.types.Sort;
const RangeModifier = Dashboards.DataModifier.types.Range;

const mathModifier = new MathModifier({
    type: 'Math',
    columnFormulas: [{
        column: 'Sum',
        formula: 'B1+C1+D1'
    }]
});

const sortModifier = new SortModifier({
    type: 'Sort',
    orderByColumn: 'Jane',
    order: 'asc'
});

const rangeModifier = new RangeModifier({
    type: 'Range',
    ranges: [{
        column: 'John',
        minValue: 4,
        maxValue: 7
    }]
});

// Modifier lookup, the order must reflect the dropdown in demo.html
const dataModifiers = [null, mathModifier, sortModifier, rangeModifier];

async function applyDataModifier(idx) {
    const connector = board.dataPool.connectors['conn-mod'];
    await connector.table.setModifier(dataModifiers[idx]);
}

dataModifierSelect.addEventListener('input', async e => {
    const idx = e.target.value;
    if (idx >= dataModifiers.length) {
        return;
    }
    await applyDataModifier(idx);
});
