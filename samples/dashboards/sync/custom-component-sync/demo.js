const { Component, ComponentRegistry } = Dashboards;

class Slider extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'Slider';
        this.createDOMStructure();
        this.xColumn = [];
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );
        return this;
    }

    createDOMStructure() {
        this.slider = document.createElement('input');
        this.handleLabel = document.createElement('span');
        this.maxSliderLabel = document.createElement('span');
        this.minSliderLabel = document.createElement('span');
        this.middleSliderLabel = document.createElement('span');

        const leftSliderSide = document.createElement('div');
        const rightSliderSide = document.createElement('div');

        this.handleLabel.className = 'sc-handle-label';
        this.slider.className = 'sc-slider';
        leftSliderSide.className = 'sc-slider-side';
        rightSliderSide.className = 'sc-slider-side';

        this.contentElement.classList.add('sc-container');
        this.minSliderLabel.classList.add(
            'sc-tick-slider-label',
            'sc-min-slider-label'
        );
        this.middleSliderLabel.classList.add(
            'sc-tick-slider-label',
            'sc-middle-slider-label'
        );
        this.maxSliderLabel.classList.add(
            'sc-tick-slider-label',
            'sc-max-slider-label'
        );

        this.contentElement.appendChild(leftSliderSide);
        this.contentElement.appendChild(this.slider);
        this.contentElement.appendChild(rightSliderSide);

        leftSliderSide.appendChild(this.minSliderLabel);
        leftSliderSide.appendChild(this.middleSliderLabel);
        leftSliderSide.appendChild(this.maxSliderLabel);
        rightSliderSide.appendChild(this.handleLabel);

        this.slider.setAttribute('type', 'range');
        this.slider.setAttribute('orient', 'vertical');
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

    setConnector(connector) {
        super.setConnector(connector);
        const valuesColumnName = this.options.connector?.valuesColumn;
        const table = connector && connector.table && connector.table.modified;

        if (table && valuesColumnName) {
            this.xColumn = table.columns[valuesColumnName] || [];
        }

        this.cell.setLoadingState(false);
    }
}

ComponentRegistry.registerComponent('Slider', Slider);

const formatBigNumber = value => {
    if (value >= 1e6) {
        return Math.round(value / 1e5) / 10 + 'M';
    }
    if (value >= 1e3) {
        return Math.round(value / 1e3) + 'k';
    }
    return value;
};

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
                        const table = this.connector && this.connector.table;
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
            id: 'data'
        },
        columnAssignment: {
            Population: 'x',
            'Happiness vs Population': {
                y: 'Happiness',
                name: 'Country'
            }
        },
        chartOptions: {
            xAxis: {
                type: 'logarithmic',
                title: {
                    text: 'Population'
                }
            },
            yAxis: {
                title: {
                    text: 'Happiness'
                }
            },
            title: {
                text: 'Happiness vs Population'
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
                name: 'Happiness vs Population'
            }],
            tooltip: {
                formatter: function () {
                    const point = this.point;
                    return `
                        <b>${point.name}</b><br>
                        Population: <b>${formatBigNumber(point.x)}</b><br>
                        Happiness: <b>${point.y}</b>
                    `;
                }
            }
        },
        sync: {
            customSync: {
                enabled: true,
                syncedColumn: 'Happiness',
                handler: function () {
                    const { board } = this;
                    const { dataCursor: cursor } = board;
                    const table = this.connector && this.connector.table;
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
                                stroke: '#f25',
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
                                zIndex: 3,
                                fill: '#f25'
                            }).add();

                            xAxis.rightLabel = chart.renderer.text().attr({
                                text: rightAverage,
                                zIndex: 3,
                                align: 'right',
                                fill: '#f25'
                            }).add();
                        }

                        xAxis.mirrorBand.attr({ d: mirrorBandD });
                        xAxis.leftBand.attr({ d: leftBandD });
                        xAxis.rigthBand.attr({ d: rightBandD });
                        xAxis.leftLabel.attr({
                            text: leftAverage,
                            x: xAxis.left,
                            y: leftYPos - 10
                        });
                        xAxis.rightLabel.attr({
                            text: rightAverage,
                            x: xAxis.width + xAxis.left,
                            y: rightYPos - 10
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
                                (acc, current) => acc + current, 0) /
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
