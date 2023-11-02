const {
    Component,
    ComponentRegistry
} = Dashboards;
// eslint-disable-next-line no-underscore-dangle
const { merge, isNumber } = Dashboards._modules['Core/Utilities.js'];

class ThresholdComponent extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'Threshold';
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );
        return this;
    }

    render() {
        const options = this.options,
            value = options.value,
            thresholds = options.thresholds;

        let CurrentComponent = ComponentRegistry.types[options.component],
            componentOptions = merge(options.options || {}, {
                value
            });

        if (thresholds && isNumber(value)) {
            for (let i = 0; i < thresholds.length; i++) {
                const threshold = thresholds[i];

                if (
                    isNumber(threshold.min) && value < threshold.min ||
                    isNumber(threshold.max) && value > threshold.max
                ) {
                    continue;
                }

                componentOptions = merge(componentOptions, threshold.options);
                if (threshold.component) {
                    CurrentComponent =
                        ComponentRegistry.types[threshold.component];
                }
            }
        }

        if (!this.component || this.component !== Component) {
            this.parentElement.innerHTML = '';
            this.component =
                new CurrentComponent(this.cell, componentOptions).load();
        } else {
            this.component.update(componentOptions);
        }

        return this;
    }
}

ComponentRegistry.registerComponent('Threshold', ThresholdComponent);

const board = Dashboards.board('container', {
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }]
        }]
    },
    components: [{
        type: 'Threshold',
        cell: 'dashboard-col-0',
        component: 'HTML',
        value: 10,
        options: {
            title: {
                text: 'Threshold Component'
            },
            elements: [{
                tagName: 'p',
                textContent: `This is a demo of a custom threshold component
                that allows you to adjust your content depending on the values
                according to the appropriate thresholds. Move the slider above
                the board and see how the options and components will change.`,
                style: {
                    padding: '0 14px',
                    textAlign: 'justify'
                }
            }]
        },
        thresholds: [{
            min: 15,
            component: 'KPI',
            options: {
                title: 'KPI Component',
                subtitle: 'You can use any component here, e.g. KPI.'
            }
        }, {
            min: 40,
            max: 69,
            component: 'Highcharts',
            options: {
                title: '',
                chartOptions: {
                    title: {
                        text: 'Highcharts Component'
                    },
                    subtitle: {
                        text: 'You can use also the Highcharts Component.'
                    },
                    series: [{
                        data: [1, 2, 3],
                        animation: false
                    }]
                }
            }
        }, {
            min: 70,
            options: {
                subtitle: `Options from previous thresholds, if not overwritten
                or limited by the 'max' option, are passed to the next
                thresholds.`
            }
        }, {
            min: 80,
            options: {
                style: {
                    background: '#197'
                }
            }
        }, {
            min: 90,
            component: 'HTML',
            options: {
                title: {
                    text: 'The End'
                }
            }
        }]
    }]
});

/**
 * Demo UI section
 */

const slider = document.getElementById('slider');
const valueSpan = document.getElementById('value-label');
const componentSpan = document.getElementById('component-label');
const markers = document.getElementById('markers');
const thresholdComponent = board.mountedComponents[0].component;

thresholdComponent.options.thresholds.forEach(threshold => {
    const option = document.createElement('option');
    option.value = threshold.min;
    markers.appendChild(option);
});

slider.addEventListener('input', async e => {
    const value = +e.target.value;
    thresholdComponent.update({ value });
    valueSpan.innerHTML = value;
    componentSpan.innerHTML = (await thresholdComponent.component).type;
});
