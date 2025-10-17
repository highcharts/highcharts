const googleApiKey = 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk';
const googleSpreadsheetKey = '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw';

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'conn-raw',
            type: 'GoogleSheets',
            googleAPIKey: googleApiKey,
            googleSpreadsheetKey: googleSpreadsheetKey
        }, {
            id: 'conn-mod',
            type: 'GoogleSheets',
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
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        connector: {
            id: 'conn-raw'
        },
        type: 'Grid',
        title: 'Google Sheet Raw'
    }, {
        renderTo: 'dashboard-col-1',
        connector: {
            id: 'conn-mod'
        },
        type: 'Grid',
        title: 'Google Sheet Modified'
    }]
});
