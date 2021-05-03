(async () => {
    const { default: Highcharts } =
        await import('https://code.highcharts.com/es-modules/masters/datagrid.src.js');

    const jsonData = {
        columns: (() => {
            const makeRandomRows = () => (new Array(60)).fill('').map(() => (10 * Math.random()).toFixed(2));
            const cols = {};
            const numCols = 6;
            for (let i = 0; i < numCols; ++i) {
                cols['column' + i] = makeRandomRows();
            }
            return cols;
        })()
    };

    const grid = new Highcharts.DataGrid('container', {
        json: jsonData
    });
})();
