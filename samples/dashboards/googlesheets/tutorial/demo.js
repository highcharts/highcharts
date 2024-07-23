const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA';


/* Helper functions */
function sheetTitle(n = 1) {
    return {
        original: 'Original sheet #' + n,
        modified: 'Modified sheet #' + n
    };
}

/* Modification implementations */
function bfpModifyHeader(data) {
    data.forEach(row => {
        row[0] += '*';
    });
    // Special label from first header item
    data[0][0] = '-';

    return data;
}

function bfpModifyData(data) {
    // Derive everyone of their oranges
    data[1][2] = 0;
    data[2][2] = 0;
    data[3][2] = 0;

    return data;
}

let modSelection = 0;


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
                beforeParse: data => {
                    switch (modSelection) {
                    case 1:
                        return bfpModifyHeader(data);
                    case 2:
                        return bfpModifyData(data);
                    default:
                        return data;
                    }
                }
            }
        }]
    },
    components: [{
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

const modification = document.getElementById('modification');
const sheet = document.getElementById('sheet');

sheet.addEventListener('input', async event => {
    console.log('Sheet event:', event);

    // The sheet selection has changed
    const worksheet = Number(event.target.value) + 1;

    // Update the original sheet component
    let conn = board.dataPool.connectors['conn-orig'];
    conn.options.worksheet = worksheet;
    await conn.load();

    let comp = board.getComponentByCellId('orig-sheet-cell');
    const title = sheetTitle(worksheet);
    await comp.update({
        title: {
            text: title.original
        }
    });

    // Update the modified sheet component
    conn = board.dataPool.connectors['conn-mod'];
    conn.options.worksheet = worksheet;
    await conn.load();

    comp = board.getComponentByCellId('mod-sheet-cell');
    await comp.update({
        title: {
            text: title.modified
        }
    });
});

const bfpExecuter = [null, bfpModifyHeader, bfpModifyData];

modification.addEventListener('input', async event => {
    console.log('Mod event:', event);

    const i = Number(event.target.value);
    const conn = board.dataPool.connectors['conn-mod'];

    if (i < bfpExecuter.length) {
        modSelection = i;
        // Update the modified sheet component
        await conn.load();
    }
});
