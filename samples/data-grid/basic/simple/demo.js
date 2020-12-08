(async () => {
    const { default: Highcharts } =
        await import('https://code.highcharts.com/es-modules/masters/datagrid.src.js');

    const rows = new Array(60);
    const numCols = 5;    
    const data = rows
        .fill('')
        .map(() => (new Array(numCols)).fill('').map(() => (10 * Math.random()).toFixed(2)));

    const grid = new Highcharts.DataGrid('container', {
        json: data
    });
})();
