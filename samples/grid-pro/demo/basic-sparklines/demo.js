// Defined zones here to use in various sparkline options.
const sharedPlotOptions = {
    series: {
        zones: [{
            value: 0.5,
            color: '#9998'
        }, {
            value: 60,
            color: '#4caf50'
        }, {
            value: 85,
            color: '#ebcb3b'
        }, {
            color: '#f44336'
        }]
    }
};

const liveIcon = `
<svg width="19" height="18" fill="none">
    <path d="M17.5026 7.50163L17.1073 4.33882C16.9522 3.09831 16.8747 
    2.47804 16.5827 2.01062C16.3255 1.59881 15.954 1.2708 15.5134 
    1.06666C15.0134 0.834961 14.3883 0.834961 13.1381 0.834961H5.2004C
    3.95022 0.834961 3.32514 0.834961 2.82512 1.06666C2.38458 1.2708 
    2.01302 1.59881 1.75582 2.01062C1.46389 2.47804 1.38635 3.0983 
    1.23129 4.33882L0.835938 7.50163M3.7526 10.835H14.5859M3.7526 
    10.835C2.14177 10.835 0.835938 9.52912 0.835938 7.91829C0.835938 
    6.30746 2.14177 5.00163 3.7526 5.00163H14.5859C16.1968 5.00163 
    17.5026 6.30746 17.5026 7.91829C17.5026 9.52912 16.1968 10.835 
    14.5859 10.835M3.7526 10.835C2.14177 10.835 0.835938 12.1408 
    0.835938 13.7516C0.835938 15.3625 2.14177 16.6683 3.7526 16.6683H
    14.5859C16.1968 16.6683 17.5026 15.3625 17.5026 13.7516C17.5026 
    12.1408 16.1968 10.835 14.5859 10.835M4.16927 7.91829H4.1776M
    4.16927 13.7516H4.1776M9.16927 7.91829H14.1693M9.16927 13.7516H
    14.1693" stroke="#00A96B" stroke-width="1.67" stroke-linecap="round" />
</svg>
`;

const offlineIcon = `
<svg width="17" height="19" fill="none">
    <path d="M5.0026 5.83508L1.74715 9.74163C1.45648 10.0904 1.31114 10.2648
    1.30892 10.4121C1.30699 10.5402 1.36405 10.662 1.46365 10.7425C1.57823
    10.8351 1.80525 10.8351 2.2593 10.8351H8.33594L7.5026 17.5017L11.6693
    12.5017M11.3776 7.50175H14.4126C14.8666 7.50175 15.0936 7.50175 15.2082
    7.59434C15.3078 7.67483 15.3649 7.79665 15.363 7.9247C15.3607 8.07199
    15.2154 8.2464 14.9247 8.59521L13.7945 9.9515M7.14657 3.26229L9.16924
    0.835083L8.66948 4.83318M15.8359 16.6684L0.835938 1.66842"
    stroke="#DC2626" stroke-width="1.67" stroke-linecap="round"/>
</svg>
`;

const grid = Grid.grid('container', {
    data: {
        columns: {
            server: [
                'Flux01', 'Nexus02', 'Vex03', 'Pulse04', 'Drift05', 'Ion06'
            ],
            region: [
                'USA', 'Africa', 'Europe', 'Asia', 'S. America', 'Australia'
            ],
            live: [
                true, true, true, true, false, true
            ],
            ip: [
                '203.0.113.45', '198.51.100.23', '128.11.120.26',
                '185.220.100.12', '200.100.50.88', '213.20.13315'

            ],
            disk: [
                4, 9, 80, 30, 0, 50
            ],
            cpu: [
                '15, 18, 29, 48, 56, 54, 34',
                '99, 96, 82, 53, 33, 22, 29',
                '1, 4, 24, 65, 79, 77, 52',
                '50, 54, 64, 78, 89, 96, 99',
                '',
                '20, 21, 22, 25, 28, 31, 35'
            ],
            ram: [
                '28, 35, 41, 41, 43, 80, 85, 90, 63, 100, 40, 25, 27, 34, 30',
                '76, 79, 77, 72, 67, 63, 63, 56, 54, 49, 42, 38, 42, 33, 28',
                '49, 55, 57, 67, 69, 72, 78, 78, 75, 72, 72, 67, 61, 61, 54',
                '90, 95, 100, 100, 70, 26, 20, 22, 28, 24, 29, 26, 39, 35, 55',
                '',
                '40, 40, 40, 41, 39, 38, 40, 42, 39, 69, 63, 67, 61, 65, 64'
            ]
        }
    },
    rendering: {
        theme: 'hcg-theme-default theme-servers'

    },
    columns: [{
        id: 'server',
        header: {
            format: 'Servers'
        },
        cells: {
            formatter() {
                const icon = (this.row.data.live) ? liveIcon : offlineIcon;
                return `
                    <div class="server">
                        <div class="icon">
                            ${icon}
                        </div>
                        <div class="text">
                            <div>${this.value}</div>
                            <div class="region">${this.row.data.region}</div>
                        </div>
                    </div>
                `;
            }
        }
    }, {
        id: 'region',
        enabled: false
    }, {
        id: 'live',
        width: 150,
        header: {
            format: 'Status'
        },
        cells: {
            format: `{#if value}
                <div class="status">Live</div>
            {else}
                <div class="status offline">Offline</div>
            {/if}`
        }
    }, {
        id: 'ip',
        header: {
            format: 'IP'
        }
    },  {
        id: 'disk',
        width: 120,
        className: 'hcg-center',
        header: {
            format: 'Disk Usage'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: function (data) {
                    return {
                        chart: {
                            type: 'pie',
                            height: 30
                        },
                        series: [{
                            innerSize: '70%',
                            data: [{
                                y: data,
                                color: sharedPlotOptions.series.zones.find(
                                    zone => data <= (zone.value || Infinity)
                                ).color
                            }, {
                                y: 100 - data,
                                color: '#9994'
                            }]
                        }]
                    };
                }
            }
        }
    }, {
        id: 'cpu',
        width: 120,
        header: {
            format: 'CPU Usage'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    plotOptions: sharedPlotOptions
                }
            }
        }
    }, {
        id: 'ram',
        width: 120,
        header: {
            format: 'RAM Usage'
        },
        cells: {
            renderer: {
                type: 'sparkline',
                chartOptions: {
                    chart: {
                        type: 'column'
                    },
                    plotOptions: sharedPlotOptions
                }
            }
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 700
            },
            gridOptions: {
                header: ['server', 'cpu', 'ram']
            }
        }]
    }
});

// Live updates for the demo. It simulates live data updates by randomly
// changing the sparkline cells' data every 0.5-2 seconds.
(data => {
    function scheduleUpdate(rowIndex) {
        const delay = Math.random() * 1500 + 500;
        setTimeout(async () => {
            await updateInstanceStatus(rowIndex);
            scheduleUpdate(rowIndex);
        }, delay);
    }

    // Schedule updates for all rows in the data table.
    for (let i = 0, iEnd = data.getRowCount(); i < iEnd; i++) {
        scheduleUpdate(i);
    }

    // Function to generate a new dummy sparkline data array
    // based on the old one.
    function generateArrayFlow(stringArray) {
        const r = Math.random() * 2 - 1;
        const change = Math.floor(r * r * r * 30);

        const array = stringArray.split(',').map(Number);
        array.shift();
        array.push(
            Highcharts.clamp(array[array.length - 1] + change, 0, 100)
        );

        return array.join(', ');
    }

    // Function to update the instance status in the data table and refresh the
    // cells. It updates the data even if the cells are not rendered in the
    // grid.
    async function updateInstanceStatus(rowIndex) {
        const live = data.getCell('live', rowIndex);
        if (!live) {
            return;
        }

        const oldRam = data.getCell('ram', rowIndex);
        const oldCpu = data.getCell('cpu', rowIndex);

        // Data Table cells can be updated directly, even if the cells are not
        // rendered in the grid.
        data.setCell(
            'ram',
            rowIndex,
            generateArrayFlow(oldRam)
        );
        data.setCell(
            'cpu',
            rowIndex,
            generateArrayFlow(oldCpu)
        );
        data.setCell(
            'disk',
            rowIndex,
            Math.round(Math.random() * 100)
        );

        const row = grid?.viewport.getRow(rowIndex);
        if (!row) {
            return;
        }

        // Apply the modifiers to the data table.
        await grid.querying.proceed(true);

        // Reload the column caches from the provider's presentation table.
        for (const column of grid.viewport.columns) {
            column.loadData();
        }

        // row.loadData() is used to fetch the data from the data table into the
        // `row.data` object, because unlike the `column.data`, the `row.data`
        // is not a direct reference to the data table, but a copy of the data
        // for the row.
        row.loadData();

        row.cells.forEach(cell => {
            // `cell.setValue()` without arguments will refresh the cell with
            // the current value from the data table.
            cell.setValue();
        });
    }
})(grid.dataProvider.getDataTable());
