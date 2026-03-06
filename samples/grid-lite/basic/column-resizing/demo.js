const columnIds = ['A', 'B', 'C', 'D', 'E'];
Grid.setOptions({
    columnDefaults: {
        cells: {
            formatter() {
                const rawWidth = this.column.options.width;
                if (rawWidth === 'auto' || rawWidth === void 0) {
                    return 'auto';
                }

                if (typeof rawWidth === 'number') {
                    return `${Math.round(this.column.getWidth() * 10) / 10}px`;
                }

                return rawWidth;
            }
        }
    },
    data: {
        columns: columnIds.reduce((acc, columnId) => {
            acc[columnId] = [''];
            return acc;
        }, {})
    },
    rendering: {
        rows: {
            minVisibleRows: 1
        }
    }
});

const grids = [
    Grid.grid('grid-adjacent', {
        caption: {
            text: 'Adjacent resizing'
        },
        rendering: {
            columns: {
                resizing: {
                    mode: 'adjacent'
                }
            }
        }
    }),
    Grid.grid('grid-independent', {
        caption: {
            text: 'Independent resizing'
        },
        rendering: {
            columns: {
                resizing: {
                    mode: 'independent'
                }
            }
        }
    }),
    Grid.grid('grid-distributed', {
        caption: {
            text: 'Distributed resizing'
        },
        rendering: {
            columns: {
                resizing: {
                    mode: 'distributed'
                }
            }
        }
    })
];


// =============== HELPERS ===============

const resetButtons = document.querySelectorAll('[data-grid-index]');
const updateWidthRow = grid => {
    const row = grid?.viewport?.rows?.[0];
    row?.update();
};

const findGridForTarget = target => grids.find(
    grid => grid?.container && grid.container.contains(target)
);

let updateScheduled = false;
const scheduleGridUpdate = grid => {
    if (updateScheduled || !grid) {
        return;
    }

    updateScheduled = true;
    requestAnimationFrame(() => {
        updateScheduled = false;
        updateWidthRow(grid);
    });
};

const handleResizePointer = event => {
    const grid = findGridForTarget(event.target);
    if (!grid) {
        return;
    }

    scheduleGridUpdate(grid);
};

document.addEventListener('mousedown', handleResizePointer);
document.addEventListener('mousemove', event => {
    if (event.buttons !== 1) {
        return;
    }

    handleResizePointer(event);
});

resetButtons.forEach(button => {
    button.addEventListener('click', () => {
        const index = Number(button.getAttribute('data-grid-index'));
        const grid = grids[index];
        if (!grid) {
            return;
        }

        grid.update({
            columns: columnIds.map(id => ({
                id,
                width: 'auto'
            }))
        });

        requestAnimationFrame(() => updateWidthRow(grid));
    });
});

requestAnimationFrame(() => grids.forEach(updateWidthRow));
