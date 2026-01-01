Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            dataUrl: 'https://dataset-server-hc-production.up.railway.app/data?pageSize=10&page=1',
            beforeParse: function ({ data }) {
                const header = [
                    'firstName', 'lastName', 'department',
                    'role', 'projectsAssigned', 'country'
                ];
                const result = [header];

                for (const row of data) {
                    const resRow = [];
                    for (const columnId of header) {
                        resRow.push(row[columnId]);
                    }
                    result.push(resRow);
                }

                return result;
            }
        }]
    },
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [{
        renderTo: 'dashboard-col-0',
        type: 'Grid',
        connector: {
            id: 'data'
        }
    }]
}, true).then(async board => {
    const btn = document.getElementById('btn');
    const connector = await board.dataPool.getConnector('data');
    let page = 1;
    btn.addEventListener('click', () => {
        connector.update({
            dataUrl: 'https://dataset-server-hc-production.up.railway.app/data?pageSize=10&page=' + (++page)
        });
    });
});
