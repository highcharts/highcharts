import ChartComponent from  '../../../../code/es-modules/Dashboard/ChartComponent.js';
import DOMComponent from  '../../../../code/es-modules/Dashboard/DOMComponent.js';
import CSVStore from '../../../../code/es-modules/Data/Stores/CSVStore.js';

const target = document.querySelector('#container');
const secondTarget = document.querySelector('#container2');
const store = new CSVStore(undefined, {
    csv: `11,2
3,4
5,6`,
    firstRowAsNames: false
});
store.load();
const getTable = () => store.table;

new ChartComponent({
    parentElement: target,
    store,
    chartOptions: {
        series: [{
            name: 'Series from options',
            data: [1, 2, 3, 4]
        }]
    },
    dimensions: { width: 200, height: 300 }
}).render();

const widths = [300, 600, 450];
let currentLayout = 0;

new DOMComponent({
    parentElement: target,
    elements: [{
        tagName: 'span',
        attributes: {
            style: {
                textAlign: 'center'
            },
            className: 'custom-span'
        },
        textContent: '<button id="clicky">Click to randomize dataTable</button><br>' +
           '<button id="resize">Click to cycle chart sizes</button>'
    }]

}).render();

new DOMComponent({
    store,
    parentElement: target,
    elements: [{
        tagName: 'h1',
        attributes: { className: 'custom-div' },
        textContent: 'My Custom Component'
    },
    {
        tagName: 'p',
        textContent: 'Datatable as CSV:'
    },
    {
        tagName: 'textArea',
        attributes: {
            id: 'csvedit',
            rows: 10
        },
        textContent: store.save({})
    }],
    events: {
        afterRender: e => {
            document.querySelector('#clicky').addEventListener('click', () => {
                store.table.getAllRows().forEach(row => {
                    row.getCellNames().forEach(cellName => {
                        row.updateCell(
                            cellName,
                            Math.round(Math.random() * 10)
                        );
                    });
                });
            });
            document.querySelector('#resize').addEventListener('click', () => {
                // Post a message to all chart components with a callback
                e.component.postMessage({
                    callback: function () {
                        if (currentLayout >= widths.length) {
                            currentLayout = 0;
                        }
                        this.resize(widths[currentLayout], 400);
                        currentLayout++;
                    }
                }, 'chart');

            });
        },
        redraw: e => {
            // Insert the updated store data to the textArea
            e.component.elements = e.component.elements.map(el => {
                if (el.tagName === 'textArea') {
                    el.textContent = store.save({});
                }
                return el;
            });
        },
        afterRedraw: () => {
            document.querySelector('textArea').addEventListener('change', () => {
                store.options.csv = document.querySelector('textArea').value;
                store.load();
            });
        }
    }
}).render();

new ChartComponent({
    parentElement: target,
    store,
    chartOptions: {
        chart: {
            type: 'bar'
        }
    },
    className: 'highcharts-dashboard-component',
    dimensions: { width: 300, height: 400 }
}).render();