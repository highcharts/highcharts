const { Component, ComponentRegistry } = Dashboards;

class AveragesMirror extends Component {
    constructor(cell, options) {
        super(cell, options);
        this.type = 'AveragesMirror';
        this.createDOMStructure();
        this.xColumn = [];
        this.yColumn = [];
        this.sync = new Component.Sync(
            this,
            this.syncHandlers
        );
        return this;
    }

    createDOMStructure() {
        this.slider = document.createElement('input');
        this.handleLabel = document.createElement('span');
        this.leftSide = document.createElement('div');
        this.rightSide = document.createElement('div');

        const handleLabelContainer = document.createElement('div');
        const resultsContainer = document.createElement('div');
        const divider = document.createElement('div');

        handleLabelContainer.className = 'am-handle-label-container';
        this.handleLabel.className = 'am-handle-label';
        this.slider.className = 'am-slider';
        resultsContainer.className = 'am-results-container';
        this.leftSide.className = 'am-rc-left';
        this.rightSide.className = 'am-rc-right';
        divider.className = 'am-rc-divider';

        handleLabelContainer.appendChild(this.handleLabel);
        resultsContainer.appendChild(this.leftSide);
        resultsContainer.appendChild(divider);
        resultsContainer.appendChild(this.rightSide);
        this.contentElement.appendChild(handleLabelContainer);
        this.contentElement.appendChild(this.slider);
        this.contentElement.appendChild(resultsContainer);

        this.slider.setAttribute('type', 'range');
        divider.innerHTML = ':';
        this.contentElement.style.padding = '8px';
    }

    async load() {
        await super.load();
        this.sync.start();

        this.slider.addEventListener('input', event => {
            this.onSliderValueChange(event.target.value);
        });

        this.onSliderValueChange(this.slider.value);

        return this;
    }

    onSliderValueChange(value) {
        const rowIndex = Math.round((this.xColumn.length - 1) * value * 0.01);
        const xValue = this.xValue = this.xColumn[rowIndex];
        const valueFormatter = this.options.valueFormatter;
        const formattedXValue =
            valueFormatter ? valueFormatter(xValue) : xValue;
        const [leftAverage, rightAverage] = [
            this.yColumn.slice(0, rowIndex + 1),
            this.yColumn.slice(rowIndex, this.yColumn.length)
        ].map(side => Math.round(
            side.reduce((acc, current) => acc + current, 0) / side.length * 100
        ) / 100);

        this.handleLabel.innerHTML = formattedXValue;
        const lOffset = this.handleLabel.offsetWidth * value * 0.01;
        this.handleLabel.style.left = `calc(${value}% - ${lOffset}px`;

        this.leftSide.innerHTML = this.leftAverage = leftAverage;
        this.rightSide.innerHTML = this.rightAverage = rightAverage;

        // Emit event when slider value changes
        this.emit({
            target: this,
            type: 'sliderValueChanged',
            rowIndex: rowIndex
        });
    }

    setConnector(connector) {
        super.setConnector(connector);
        const { columnAssignment } = this.options;
        const table = connector && connector.table && connector.table.modified;

        if (table && columnAssignment) {
            this.xColumn = table.columns[columnAssignment.x] || [];
            this.yColumn = table.columns[columnAssignment.y] || [];
        }

        this.cell.setLoadingState(false);
    }
}

ComponentRegistry.registerComponent('AveragesMirror', AveragesMirror);

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }]
            }, {
                cells: [{
                    id: 'dashboard-col-1'
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
        renderTo: 'dashboard-col-0',
        type: 'AveragesMirror',
        title: {
            text: 'Averages Mirror'
        },
        connector: {
            id: 'data'
        },
        columnAssignment: {
            x: 'Date',
            y: 'Users'
        },
        valueFormatter: function (value) {
            return Highcharts.dateFormat('%Y-%m-%d', value);
        },
        sync: {
            customMirrorSync: {
                enabled: true,
                emitter: function () {
                    const { board } = this;
                    const { dataCursor: cursor } = board;

                    if (
                        !board ||
                        !this.sync.syncConfig.customMirrorSync.enabled
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
                                state: 'averagesMirror.move'
                            });
                        }
                    });
                }
            }
        }
    }, {
        renderTo: 'dashboard-col-1',
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        columnAssignment: {
            Date: 'x',
            Users: 'y'
        },
        chartOptions: {
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            title: {
                text: 'Example Chart'
            },
            xAxis: {
                type: 'datetime',
                crosshair: {
                    enabled: true
                }
            }
        },
        sync: {
            customMirrorSync: {
                enabled: true,
                handler: function () {
                    const { board } = this;
                    const { dataCursor: cursor } = board;
                    const table = this.connector && this.connector.table;
                    const chart = this.chart;

                    if (
                        !table || !board || !chart ||
                        !this.sync.syncConfig.customMirrorSync.enabled
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

                        if (xAxis.mirrorBand) {
                            xAxis.mirrorBand.attr({ d: mirrorBandD });
                            xAxis.leftBand.attr({ d: leftBandD });
                            xAxis.rigthBand.attr({ d: rightBandD });
                        } else {
                            xAxis.mirrorBand = chart.renderer.path().attr({
                                stroke: '#f25', d: mirrorBandD, zIndex: 1
                            }).add();

                            xAxis.leftBand = chart.renderer.path().attr({
                                stroke: '#f25', d: leftBandD, zIndex: 1
                            }).add();

                            xAxis.rigthBand = chart.renderer.path().attr({
                                stroke: '#f25', d: rightBandD, zIndex: 1
                            }).add();
                        }
                    };

                    const handleCursor = e => {
                        const target = e.cursor.target;
                        xValue = target.xValue;
                        leftAverage = target.leftAverage;
                        rightAverage = target.rightAverage;
                        drawLines();
                    };

                    cursor.addListener(
                        table.id,
                        'averagesMirror.move',
                        handleCursor
                    );
                    const removeRedrawListener =
                        Highcharts.addEvent(chart, 'redraw', drawLines);

                    // Remove listeners when component is destroyed
                    return () => {
                        removeRedrawListener();
                        cursor.removeListenerr(
                            table.id,
                            'averagesMirror.move',
                            handleCursor
                        );
                    };
                }
            }
        }
    }]
});
