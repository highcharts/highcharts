let savedOptions = {
    editMode: {
        enabled: true,
        contextMenu: {
            enabled: true
        }
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'fetched-columns',
                    height: '200px',
                    width: '65%'
                }]
            }]
        }]
    },
    dataPool: {
        connectors: [{
            id: 'fetch-data',
            type: 'JSON',
            firstRowAsNames: false,
            columnIds: ['time', 'open', 'high', 'low', 'close', 'volume'],
            dataUrl: 'https://demo-live-data.highcharts.com/aapl-ohlcv.json',
            enablePolling: true,
            dataRefreshRate: 10
        }]
    },
    components: [{
        renderTo: 'fetched-columns',
        type: 'KPI',
        connector: {
            id: 'fetch-data'
        },
        columnId: 'high'
    }]
};

let board;

async function renderBoard() {
    const board = await Dashboards.board('container', savedOptions, true);
    return board;
}

const destroy = document.getElementById('destroy');
const render = document.getElementById('render');

renderBoard();

destroy.addEventListener('click', () => {
    savedOptions = board.getOptions();
    board.destroy();
});

render.addEventListener('click', () => {
    renderBoard();
});
