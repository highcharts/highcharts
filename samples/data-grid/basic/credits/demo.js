/* eslint-disable max-len */

const dataTable = new DataGrid.DataTable({
    columns: {
        product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes'],
        weight: [100, 40, 0.5, 200, 150, 75],
        price: [1.5, 2.53, 5, 4.5, 1.2, 2.1],
        metaData: ['a', 'b', 'c', 'd', 'e', 'f']
    }
});

const dataGrid = DataGrid.dataGrid('container', {
    dataTable: dataTable
});

document.getElementById('no-data-cbx').addEventListener('change', e => {
    dataGrid.update({
        dataTable: e.target.checked ? {} : dataTable
    });
});

const enabledOption = document.getElementById('enabled-option');
const textOption = document.getElementById('text-option');
const hrefOption = document.getElementById('href-option');
const positionOption = document.getElementById('position-option');

enabledOption.checked = dataGrid.options.credits.enabled;
textOption.value = dataGrid.options.credits.text;
hrefOption.value = dataGrid.options.credits.href;
positionOption.value = dataGrid.options.credits.position;

// document.getElementsByClassName('option-input').forEach(input => {
//     console.log(input);
// });

document.getElementById('credits-update').addEventListener('change', () => {
    if (dataGrid.credits) {
        dataGrid.credits.update({
            enabled: enabledOption.checked,
            text: textOption.value,
            href: hrefOption.value,
            position: positionOption.value
        });
    } else {
        dataGrid.update({
            credits: {
                enabled: enabledOption.checked,
                text: textOption.value,
                href: hrefOption.value,
                position: positionOption.value
            }
        });
    }
});

document.getElementById('credits-update').addEventListener('submit', e => {
    e.preventDefault();
});
