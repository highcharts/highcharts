const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA';

const board = setupBoard();

/* Helper functions */
function sheetTitle(n = 1) {
    return {
        original: 'Original sheet #' + n,
        modified: 'Modified sheet #' + n
    };
}

/* Modification implementations */
function bfpModifyHeader(data) {
    console.log('bfpModifyHeader', data);
    data.forEach(row => {
        row[0] += '*';
    });
    // Special label from first header item
    data[0][0] = '-';

    return data;
}

function bfpModifyData(data) {
    console.log('bfpModifyData', data);

    // Supply Jane with additional pears
    data[2][3] += 5;

    // Deprive Joe of his pears
    data[2][4] = 0;

    return data;
}

/* Create the Dashboard */
async function setupBoard() {
    const board = await Dashboards.board('container', {
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
                    beforeParse: null
                }
            }]
        },
        components: [{
            renderTo: 'orig-sheet-cell',
            connector: {
                id: 'conn-orig'
            },
            type: 'DataGrid',
            title: sheetTitle().original,
            dataGridOptions: {
                editable: false
            }
        }, {
            renderTo: 'mod-sheet-cell',
            connector: {
                id: 'conn-mod'
            },
            type: 'DataGrid',
            title: sheetTitle().modified,
            dataGridOptions: {
                editable: false
            }
        }]
    });
    return board;
}

const modification = document.getElementById('modification');
const sheet = document.getElementById('sheet');

sheet.addEventListener('input', async event => {
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
    const i = Number(event.target.value);
    const conn = board.dataPool.connectors['conn-mod'];

    if (i < bfpExecuter.length) {
        const modMethod = bfpExecuter[i];

        // Update the modified sheet component
        if (modMethod) {
            // Update the original sheet component
            conn.options.beforeParse = modMethod;
            await conn.load();
        }
        const comp = board.getComponentByCellId('mod-sheet-cell');
        await comp.update({
            title: {
                text: 'title.modified'
            }
        });
    }
});
