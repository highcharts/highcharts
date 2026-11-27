import * as Grid from '@highcharts/grid-pro';
import '@highcharts/grid-pro/css/grid-pro.css';

const lastEdit = document.getElementById('last-edit')!;
const dataTable = new Grid.DataTable({
    columns: {
        fruit: ['Pear', 'Apple'],
        quantity: [2, 5]
    }
});

Object.assign(window, {
    getSourceQuantity: () => dataTable.getCell('quantity', 0)
});

Grid.grid('grid', {
    credits: { enabled: false },
    data: { dataTable },
    columns: [{
        id: 'quantity',
        cells: {
            editMode: {
                enabled: true,
                renderer: { type: 'numberInput' }
            },
            events: {
                afterEdit() {
                    lastEdit.textContent = `${this.column.id}: ${this.value} (${typeof this.value})`;
                }
            }
        }
    }]
});
