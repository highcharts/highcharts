const { ComponentRegistry } = Dashboards,
    HTMLComponent = ComponentRegistry.types.HTML,
    AST = Highcharts.AST;
class CustomHTML extends HTMLComponent {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'CustomHTML';
        this.getCustomHTML();
        return this;
    }

    getCustomHTML() {
        const options = this.options;
        if (options.id) {
            const customHTML = document.getElementById(options.id).outerHTML;

            this.options.elements = new AST(customHTML).nodes;
        } else if (options.html) {
            this.options.elements = new AST(options.html).nodes;
        }
    }
}

ComponentRegistry.registerComponent('CustomHTML', CustomHTML);

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }, {
                    id: 'dashboard-col-2'
                }]
            }]
        }]
    },
    components: [{
        type: 'CustomHTML',
        cell: 'dashboard-col-0',
        id: 'custom-html-div' // id of the element which already exists in the DOM
    }, {
        type: 'CustomHTML',
        cell: 'dashboard-col-1',
        html: `
            <div>
                <h1>Custom HTML 2</h1>
                <span id="custom-html-div-2">Custom HTML added as string </span>
            </div>`
    },
    {
        cell: 'dashboard-col-2',
        type: 'Highcharts',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
