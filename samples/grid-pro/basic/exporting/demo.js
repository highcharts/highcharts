const csvExport = document.querySelector('#csvExport');
const jsonBtn = document.querySelector('#jsonExport');
const csvDownload = document.querySelector('#csvDownload');
const jsonDownload = document.querySelector('#jsonDownload');
const result = document.querySelector('#result');

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
    result.innerHTML =  grid.exporting.getCSV();
});

jsonBtn.addEventListener('click', () => {
    result.innerHTML = grid.exporting.getJSON();
});

csvDownload.addEventListener('click', () => {
    grid.exporting.downloadCSV();
});

jsonDownload.addEventListener('click', () => {
    grid.exporting.downloadJSON();
});