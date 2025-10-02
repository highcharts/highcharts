// Google Sheets Credentials
const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA';

// Calculate sheet title based on the sheet number
function sheetTitle(name = 'Sheet 1') {
    return {
        original: 'Original - ' + name,
        modified: 'Modified - ' + name
    };
}

// Various 'beforeParse' functions
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
    // Deprive everyone of the fruit in row 2
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
            googleAPIKey: googleApiKey,
            googleSpreadsheetKey: googleSpreadsheetKey
        }, {
            id: 'conn-mod',
            type: 'GoogleSheets',
            googleAPIKey: googleApiKey,
            googleSpreadsheetKey: googleSpreadsheetKey,
            beforeParse: data =>
                beforeParseFunction[beforeParseSelector](data)
        }]
    },
    components: [{
        // Original sheet
        type: 'Grid',
        renderTo: 'orig-sheet-cell',
        connector: {
            id: 'conn-orig'
        },
        title: sheetTitle().original,
        gridOptions: {
            credits: {
                enabled: false
            }
        }
    }, {
        // Modified sheet
        type: 'Grid',
        renderTo: 'mod-sheet-cell',
        connector: {
            id: 'conn-mod'
        },
        title: sheetTitle().modified,
        gridOptions: {
            credits: {
                enabled: false
            }
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
    const worksheet = e.target.value;

    // Update the original sheet component
    let connector = board.dataPool.connectors['conn-orig'];
    connector.options.googleSpreadsheetRange = worksheet;

    let comp = board.getComponentByCellId('orig-sheet-cell');
    const title = sheetTitle(worksheet);
    await comp.update({
        title: {
            text: title.original
        }
    });
    await connector.load();

    // Update the modified sheet component
    connector = board.dataPool.connectors['conn-mod'];
    connector.options.googleSpreadsheetRange = worksheet;

    comp = board.getComponentByCellId('mod-sheet-cell');
    await comp.update({
        title: {
            text: title.modified
        }
    });
    await connector.load();

    // Re-apply data modifier
    await applyDataModifier(dataModifierSelect.value);
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
const FilterModifier = Dashboards.DataModifier.types.Filter;

const mathModifier = new MathModifier({
    columnFormulas: [{
        column: 'Sum',
        formula: 'B1+C1+D1'
    }]
});

const sortModifier = new SortModifier({
    orderByColumn: 'Jane',
    order: 'asc'
});

const filterModifier = new FilterModifier({
    condition: {
        operator: 'and',
        conditions: [{
            operator: '>=',
            column: 'John',
            value: 4
        }, {
            operator: '<=',
            column: 'John',
            value: 7
        }]
    }
});

// DataModifier lookup, the order must reflect the dropdown in demo.html
const dataModifiers = [null, mathModifier, sortModifier, filterModifier];

async function applyDataModifier(idx) {
    const connector = board.dataPool.connectors['conn-mod'];
    await connector.getTable().setModifier(dataModifiers[idx]);
}

dataModifierSelect.addEventListener('input', async e => {
    const idx = e.target.value;
    if (idx >= dataModifiers.length) {
        return;
    }
    await applyDataModifier(idx);
});
