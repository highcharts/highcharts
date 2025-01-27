const { Component, ComponentRegistry } = Dashboards;

class Slider extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'Slider';
        this.createDOMStructure();
        this.xColumn = [];
        return this;
    }

    createDOMStructure() {
        const H = Highcharts;

        const leftSliderSide = H.createElement('div', {
            className: 'sc-slider-side'
        }, {}, this.contentElement);

        this.slider = H.createElement('input', {
            className: 'sc-slider',
            type: 'range',
            orient: 'vertical'
        }, {}, this.contentElement);

        const rightSliderSide = H.createElement('div', {
            className: 'sc-slider-side'
        }, {}, this.contentElement);

        this.maxSliderLabel = H.createElement('span', {
            className: 'sc-tick-slider-label sc-max-slider-label'
        }, {}, leftSliderSide);

        this.minSliderLabel = H.createElement('span', {
            className: 'sc-tick-slider-label sc-min-slider-label'
        }, {}, leftSliderSide);

        this.middleSliderLabel = H.createElement('span', {
            className: 'sc-tick-slider-label sc-middle-slider-label'
        }, {}, leftSliderSide);

        this.handleLabel = H.createElement('span', {
            className: 'sc-handle-label'
        }, {}, rightSliderSide);

        this.contentElement.classList.add('sc-container');
    }

    async load() {
        await super.load();
        this.sync.start();

        this.slider.addEventListener('input', event => {
            this.onSliderValueChange(event.target.value);
        });

        this.onSliderValueChange(this.slider.value);

        const valueFormatter = this.options.valueFormatter || (value => value);
        this.minSliderLabel.innerHTML = valueFormatter(this.xColumn[0]);
        this.middleSliderLabel.innerHTML =
            valueFormatter(this.xColumn[Math.round(this.xColumn.length / 2)]);
        this.maxSliderLabel.innerHTML =
            valueFormatter(this.xColumn[this.xColumn.length - 1]);

        return this;
    }

    onSliderValueChange(value) {
        const rowIndex = Math.round((this.xColumn.length - 1) * value * 0.01);
        const xValue = this.xValue = this.xColumn[rowIndex];
        const valueFormatter = this.options.valueFormatter;
        const formattedXValue =
            valueFormatter ? valueFormatter(xValue) : xValue;

        this.handleLabel.innerHTML = formattedXValue;
        const lOffset = this.handleLabel.offsetHeight * (100 - value) * 0.01;
        this.handleLabel.style.top = `calc(${100 - value}% - ${lOffset}px`;

        // Emit event when slider value changes
        this.emit({
            target: this,
            type: 'sliderValueChanged',
            rowIndex: rowIndex
        });
    }

    async initConnectors() {
        await super.initConnectors();

        const mainConnectorHandler = this.connectorHandlers[0] || {};
        const table = mainConnectorHandler.connector &&
            mainConnectorHandler.connector.table;
        const valuesColumnName = mainConnectorHandler.options &&
            mainConnectorHandler.options.valuesColumn;

        if (table && valuesColumnName) {
            this.xColumn = table.columns[valuesColumnName] || [];
        }

        this.cell.setLoadingState(false);
    }
}

ComponentRegistry.registerComponent('Slider', Slider);

const formatBigNumber = value => {
    if (value >= 1e9) {
        return Math.round(value / 1e6) / 1e3 + 'B';
    }
    if (value >= 1e6) {
        return Math.round(value / 1e5) / 10 + 'M';
    }
    if (value >= 1e3) {
        return Math.round(value / 1e3) + 'K';
    }
    return value;
};

Highcharts.setOptions({
    lang: {
        numericSymbols: ['K', 'M', 'B', 'T', 'P', 'E']
    }
});

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'chart-cell'
                }, {
                    id: 'slider-cell'
                }]
            }]
        }]
    },
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'CSV',
            options: {
                csv: document.getElementById('csv').innerHTML
            }
        }]
    },
    components: [{
        renderTo: 'slider-cell',
        type: 'Slider',
        title: {
            text: 'Population'
        },
        connector: {
            id: 'data',
            valuesColumn: 'Population'
        },
        valueFormatter: value => formatBigNumber(value),
        sync: {
            customSync: {
                enabled: true,
                emitter: function () {
                    const { board } = this;
                    const { dataCursor: cursor } = board;

                    if (
                        !board ||
                        !this.sync.syncConfig.customSync.enabled
                    ) {
                        return;
                    }

                    return this.on('sliderValueChanged', e => {
                        const connector = this.getFirstConnector();
                        const table = connector && connector.table;

                        if (table) {
                            // Emit cursor event when slider value changes
                            cursor.emitCursor(table, {
                                type: 'position',
                                row: e.rowIndex,
                                target: this,
                                state: 'sliderComponent.move'
                            });
                        }
                    });
                }
            }
        }
    }, {
        renderTo: 'chart-cell',
        type: 'Highcharts',
        connector: {
            id: 'data',
            columnAssignment: [{
                seriesId: 'happiness-vs-population',
                data: {
                    x: 'Population',
                    y: 'Happiness Score',
                    name: 'Country'
                }
            }]
        },
        chartOptions: {
            chart: {
                marginRight: 50
            },
            xAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Population'
                }
            },
            yAxis: {
                title: {
                    text: 'Happiness Score'
                }
            },
            title: {
                text: 'Happiness Score vs Population 2022'
            },
            subtitle: {
                text: 'Showing average happiness score below and above the ' +
                    'chosen population.'
            },
            credits: {
                text: 'worldhappiness.report',
                href: 'https://worldhappiness.report/'
            },
            legend: {
                enabled: false
            },
            series: [{
                type: 'scatter',
                name: 'Happiness Score vs Population',
                id: 'happiness-vs-population'
            }],
            tooltip: {
                formatter: function () {
                    const point = this.point;
                    return `
                        <b>${point.name}</b><br>
                        Population: <b>${formatBigNumber(point.x)}</b><br>
                        Happiness Score: <b>${point.y}</b>
                    `;
                }
            }
        },
        sync: {
            customSync: {
                enabled: true,
                syncedColumn: 'Happiness Score',
                handler: function () {
                    const { board } = this;
                    const { dataCursor: cursor } = board;
                    const connectorHandler = this.connectorHandlers[0];
                    const table = connectorHandler &&
                        connectorHandler.connector &&
                        connectorHandler.connector.table;
                    const chart = this.chart;
                    const syncedColumnName =
                        this.sync.syncConfig.customSync.syncedColumn;

                    if (
                        !table || !board || !chart ||
                        !this.sync.syncConfig.customSync.enabled
                    ) {
                        return;
                    }

                    let xValue,
                        leftAverage,
                        rightAverage;

                    const drawLines = () => {
                        const xAxis = chart.xAxis[0];
                        const yAxis = chart.yAxis[0];
                        const bandXPos = xAxis.toPixels(xValue);
                        const leftYPos = yAxis.toPixels(leftAverage);
                        const rightYPos = yAxis.toPixels(rightAverage);

                        const mirrorBandD = [
                            'M', xAxis.toPixels(xValue), xAxis.top,
                            'l', 0, xAxis.height
                        ];

                        const leftBandD = [
                            'M', xAxis.left, leftYPos,
                            'L', bandXPos, leftYPos
                        ];

                        const rightBandD = [
                            'M', bandXPos, rightYPos,
                            'L', xAxis.width + xAxis.left, rightYPos
                        ];

                        if (!xAxis.mirrorBand) {
                            xAxis.mirrorBand = chart.renderer.path().attr({
                                stroke: '#9a9a9a',
                                zIndex: 3,
                                'stroke-dasharray': 5
                            }).add();

                            xAxis.leftBand = chart.renderer.path().attr({
                                stroke: '#f25',
                                zIndex: 3,
                                'stroke-width': 2
                            }).add();

                            xAxis.rigthBand = chart.renderer.path().attr({
                                stroke: '#f25',
                                zIndex: 3,
                                'stroke-width': 2
                            }).add();

                            xAxis.leftLabel = chart.renderer.text().attr({
                                text: leftAverage,
                                align: 'right',
                                fill: '#f25'
                            }).addClass('chart-custom-label').add().toFront();

                            xAxis.rightLabel = chart.renderer.text().attr({
                                text: rightAverage,
                                fill: '#f25'
                            }).addClass('chart-custom-label').add().toFront();
                        }

                        xAxis.mirrorBand.attr({ d: mirrorBandD });
                        xAxis.leftBand.attr({ d: leftBandD });
                        xAxis.rigthBand.attr({ d: rightBandD });
                        xAxis.leftLabel.attr({
                            text: leftAverage,
                            x: bandXPos - 10,
                            y: leftYPos - 8
                        });
                        xAxis.rightLabel.attr({
                            text: rightAverage,
                            x: bandXPos + 10,
                            y: rightYPos - 8
                        });
                    };

                    const handleCursor = e => {
                        const target = e.cursor.target;
                        const rowIndex = e.cursor.row;
                        const yColumn = e.table.columns[syncedColumnName];

                        const averages = [
                            yColumn.slice(0, rowIndex + 1),
                            yColumn.slice(rowIndex, yColumn.length)
                        ].map(side => Math.round(
                            side.reduce(
                                (acc, current) => acc + current, 0
                            ) /
                                side.length * 100
                        ) / 100);

                        xValue = target.xValue;
                        leftAverage = averages[0];
                        rightAverage = averages[1];

                        drawLines();
                    };

                    cursor.addListener(
                        table.id,
                        'sliderComponent.move',
                        handleCursor
                    );
                    const removeRedrawListener =
                        Highcharts.addEvent(chart, 'redraw', drawLines);

                    // Remove listeners when the component is destroyed
                    return () => {
                        removeRedrawListener();
                        cursor.removeListenerr(
                            table.id,
                            'sliderComponent.move',
                            handleCursor
                        );
                    };
                }
            }
        }
    }]
});
