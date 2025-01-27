const { ComponentRegistry } = Dashboards,
    HTMLComponent = ComponentRegistry.types.HTML;

class TotalRevenueHTML extends HTMLComponent {
    constructor(cell, options) {
        super(cell, options);

        this.type = 'TotalRevenueHTML';

        return this;
    }

    async load() {
        await super.load();
        const revenue = this.getTotalRevenue();

        this.options.elements = this.getElementsFromString(
            `
            <div class="revenue">
                <p class="title">Total revenue</p>
                <p class="value">${revenue} €</p>
            </div>
            `
        );
        this.render();
    }

    getTotalRevenue() {
        const connector = this.getFirstConnector();
        const table = connector.table.modified;

        return table.columns.Revenue.reduce((acc, cur) => acc + cur);
    }
}

ComponentRegistry.registerComponent('TotalRevenueHTML', TotalRevenueHTML);

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['Product Name', 'Quantity', 'Revenue', 'Category'],
                    ['Laptop', 100, 2000, 'Electronics'],
                    ['Smartphone', 150, 3300, 'Electronics'],
                    ['Desk Chair', 120, 2160, 'Furniture'],
                    ['Coffee Maker', 90, 1890, 'Appliances'],
                    ['Headphones', 200, 3200, 'Electronics'],
                    ['Dining Table', 130, 2470, 'Furniture'],
                    ['Refrigerator', 170, 2890, 'Appliances']
                ]
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'cell-id-0'
                }, {
                    id: 'cell-id-1'
                }, {
                    id: 'cell-id-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'TotalRevenueHTML',
        renderTo: 'cell-id-0',
        connector: {
            id: 'data'
        }
    }, {
        type: 'Highcharts',
        renderTo: 'cell-id-1',
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'mySeriesId',
                data: ['Product Name', 'Revenue']
            }]
        },
        sync: {
            highlight: true
        },
        chartOptions: {
            chart: {
                animation: false,
                marginTop: 40
            },
            title: '',
            legend: {
                enabled: false
            },
            xAxis: {
                type: 'category'
            },
            series: [{
                animation: false,
                id: 'mySeriesId',
                type: 'column'
            }]
        }
    }, {
        type: 'DataGrid',
        renderTo: 'cell-id-2',
        connector: {
            id: 'data'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            columns: [{
                id: 'Revenue',
                header: {
                    format: '{id} (€)'
                }
            }, {
                id: 'Category',
                enabled: false
            }]
        }
    }]
});
