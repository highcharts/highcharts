const board = Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'vegetables',
            type: 'CSV',
            options: {
                csv: document.querySelector('#csv').innerHTML
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'chart'
                }]
            }, {
                cells: [{
                    id: 'grid-0'
                }, {
                    id: 'grid-1'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'chart',
        connector: {
            id: 'vegetables'
        },
        sync: {
            highlight: {
                enabled: true
            }
        },
        chartOptions: {
            title: {
                text: 'Example chart'
            },
            xAxis: {
                crosshair: true
            },
            yAxis: {
                crosshair: true
            }
        }
    },
    ...Array.from({ length: 2 }, (_, index) => ({
        type: 'DataGrid',
        renderTo: `grid-${index}`,
        connector: {
            id: 'vegetables'
        },
        sync: {
            highlight: true
        },
        dataGridOptions: {
            credits: {
                enabled: false
            }
        }
    }))]
});


/**
 * Custom code
 **/

const optionsCbx = document.querySelectorAll('.option');

optionsCbx.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const { checked } = checkbox;

        if (checkbox.id === 'cbx-chart enabled') {
            optionsCbx.forEach(cbx => {
                if (cbx.dataset.value !== 'enabled') {
                    cbx.disabled = !checked;
                }
            });
        }

        const checkboxId = checkbox.id;
        const componentIndices =
            checkboxId.includes('cbx-chart') ? [0] : [1, 2];

        componentIndices.forEach(index => {
            board.mountedComponents[index].component.update({
                ...(checkboxId.includes('enabled') && ({
                    sync: {
                        highlight: {
                            enabled: checked
                        }
                    }
                })),
                ...(checkboxId.includes('showTooltip') && ({
                    chartOptions: {
                        tooltip: {
                            enabled: checked
                        }
                    }
                })),
                ...(checkboxId.includes('highlightPoint') && ({
                    chartOptions: {
                        plotOptions: {
                            series: {
                                ...(!checked && ({
                                    events: {
                                        mouseOver() {
                                            return checked;
                                        }
                                    }
                                })),
                                marker: {
                                    states: {
                                        hover: {
                                            enabled: checked
                                        }
                                    }
                                }
                            }
                        }
                    }
                })),
                ...(checkboxId.includes('showCrosshair') && ({
                    chartOptions: {
                        xAxis: {
                            crosshair: checked
                        },
                        yAxis: {
                            crosshair: checked
                        }
                    }
                }))
            });
        });
    });
});
