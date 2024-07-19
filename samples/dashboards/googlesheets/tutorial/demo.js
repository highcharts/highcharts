const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA';

/*
googleAPIKey: '',
googleSpreadsheetKey: '',
worksheet: 1,
enablePolling: false,
dataRefreshRate: 2,
firstRowAsNames: true
*/

const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'conn-orig',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: googleApiKey,
                googleSpreadsheetKey: googleSpreadsheetKey,
                enablePolling: true,
                dataRefreshRate: 5
            }
        }, {
            id: 'conn-mod',
            type: 'GoogleSheets',
            options: {
                googleAPIKey: googleApiKey,
                googleSpreadsheetKey: googleSpreadsheetKey,
                beforeParse: data => {
                    // Postfix header items with '*'
                    data.forEach(row => {
                        row[0] += '*';
                    });

                    // Special label from first header item
                    data[0][0] = '-';

                    // Supply Jane with additional pears
                    data[2][3] += 20;

                    // Deprive Joe of his bananas
                    data[3][4] = 0;

                    return data;
                }
            }
        }]
    },
    components: [{
        renderTo: 'orig-sheet-cell',
        connector: {
            id: 'conn-orig'
        },
        type: 'DataGrid',
        title: 'Original sheet 1',
        dataGridOptions: {
            editable: false
        }
    }, {
        renderTo: 'mod-sheet-cell',
        connector: {
            id: 'conn-mod'
        },
        type: 'DataGrid',
        title: 'Modified sheet 1',
        dataGridOptions: {
            editable: false
        }
    }]
});

const modification = document.getElementById('modification');
const sheet = document.getElementById('sheet');


sheet.addEventListener('input', async e => {
    const worksheet = Number(e.target.value) + 1;

    const comp = board.getComponentByCellId('orig-sheet-cell');

    await comp.update({
        title: {
            text: 'Original sheet ' + worksheet
        },
        connector: {
            id: 'conn-orig',
            options: {
                worksheet: worksheet
            }
        }
    });
});
