const enabledOption = document.getElementById('enabled-option');
const textOption = document.getElementById('text-option');
const hrefOption = document.getElementById('href-option');
const positionOption = document.getElementById('position-option');

const dataTable = new Grid.DataTable({
    columns: {
        product: ['Apples', 'Pears', 'Plums', 'Bananas', 'Oranges', 'Grapes'],
        weight: [100, 40, 0.5, 200, 150, 75],
        price: [1.5, 2.53, 5, 4.5, 1.2, 2.1],
        metaData: ['a', 'b', 'c', 'd', 'e', 'f']
    }
});

Grid.grid('container', {
    dataTable: dataTable
}, true).then(grid => {
    const credits = grid.options.credits;

    enabledOption.checked = credits.enabled;
    textOption.value = credits.text;
    hrefOption.value = credits.href;
    positionOption.value = credits.position;

    document.getElementById('no-data-cbx').addEventListener('change', e => {
        grid.update({
            dataTable: e.target.checked ? {} : dataTable
        });
    });

    document.getElementById('credits-update').addEventListener('change', () => {

        if (grid.credits) {
            grid.credits.update({
                enabled: enabledOption.checked,
                text: textOption.value,
                href: hrefOption.value,
                position: positionOption.value
            });
        } else {
            grid.update({
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

});
