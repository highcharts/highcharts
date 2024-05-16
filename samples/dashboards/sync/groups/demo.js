Highcharts.setOptions({
    title: {
        text: ''
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    credits: {
        enabled: false
    }
});

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'data',
            type: 'JSON',
            options: {
                data: [
                    ['Click Here'],
                    [100],
                    [150],
                    [250],
                    [120],
                    [140]
                ]
            }
        }]
    },
    gui: {
        enabled: false
    },
    components: Array.from({ length: 4 }, (_, i) => ({
        renderTo: `dashboard-col-${i}`,
        type: 'Highcharts',
        connector: {
            id: 'data'
        },
        sync: {
            visibility: {
                enabled: true,
                group: i > 1 ? 'Second' : 'First'
            }
        }
    }))
}, true).then(board => {
    document.querySelectorAll('.group-select').forEach((select, i) => {
        select.innerHTML = `
            <option value="First">First Group</option>
            <option value="Second"${i > 1 ? ' selected' : ''}>
                Second Group
            </option>
            <option>Disabled</option>
        `;

        const component = board.mountedComponents[i].component;
        select.addEventListener('change', () => {
            component.update({
                sync: {
                    visibility: {
                        enabled: select.value !== 'Disabled',
                        group: select.value
                    }
                }
            });
        });
    });
});
