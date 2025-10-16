const csvExport = document.querySelector('#csvExport');
const jsonBtn = document.querySelector('#jsonExport');
const csvDownload = document.querySelector('#csvDownload');
const jsonDownload = document.querySelector('#jsonDownload');
const result = document.querySelector('#result');
const modifiedDataToggle = document.querySelector('#modifiedDataToggle');

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
            weight: [100, 40, 0.5, 200],
            price: [1.5, 2.53, 5, 4.5],
            metaData: ['a', 'b', 'c', 'd']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        }
    }
});

csvExport.addEventListener('click', () => {
    result.innerHTML = grid.exporting.getCSV(modifiedDataToggle.checked);
});

jsonBtn.addEventListener('click', () => {
    result.innerHTML = grid.exporting.getJSON(modifiedDataToggle.checked);
});

csvDownload.addEventListener('click', () => {
    grid.exporting.downloadCSV(modifiedDataToggle.checked);
});

jsonDownload.addEventListener('click', () => {
    grid.exporting.downloadJSON(modifiedDataToggle.checked);
});