const csvExport = document.querySelector('#csvExport');
const jsonBtn = document.querySelector('#jsonExport');
const csvDownload = document.querySelector('#csvDownload');
const jsonDownload = document.querySelector('#jsonDownload');
const result = document.querySelector('#result');
const modifiedDataToggle = document.querySelector('#modifiedDataToggle');

const grid = Grid.grid('container', {
    dataTable: {
        columns: {
            product: [
                'Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes',
                'Strawberries', 'Blueberries'
            ],
            weight: [100, 40, 0.5, 200, 150, 100, 50, 30],
            price: [1.5, 2.53, 5, 4.5, 3.5, 2.5, 6, 4.2],
            metaData: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        }
    },
    columnDefaults: {
        cells: {
            editMode: {
                enabled: true
            }
        },
        filtering: {
            enabled: true
        }
    },
    columns: [
        {
            id: 'price',
            enabled: false
        }
    ]
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