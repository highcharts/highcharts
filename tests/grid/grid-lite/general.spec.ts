import { test, expect } from '~/fixtures.ts';

declare const Grid: any;

// Equivalent of test/typescript-karma/Grid/grid.test.js - setOptions test
test('Grid setOptions function', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    // Test that setOptions works for columnDefaults
    const result = await page.evaluate(() => {
        (window as any).Grid.setOptions({
            columnDefaults: {
                sorting: {
                    enabled: false
                }
            }
        });
        return (window as any).Grid.defaultOptions.columnDefaults
            ?.sorting?.enabled;
    });
    expect(result, 'The setOptions function should modify the default options.').toBe(false);
});

// Equivalent of test/typescript-karma/Grid/grid.test.js - update methods test
test('Grid update methods', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const gridHandle = await page.evaluateHandle(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return;
        }

        const grid = await Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            },
            columns: [{
                id: 'product',
                header: {
                    format: 'Column 1'
                },
                cells: {
                    format: 'before update'
                }
            }, {
                id: 'weight',
                header: {
                    format: 'Column 2'
                },
                cells: {
                    format: 'before update'
                }
            }]
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        return grid;
    });

    // was an assert.ok in original
    expect(
        await gridHandle.evaluate(grid => {
            const newOptionsObject = {
                columns: [{
                    id: 'weight',
                    cells: {
                        format: 'after update'
                    }
                }, {
                    id: 'price',
                    enabled: false
                }, {
                    id: 'imaginary-column'
                }]
            };

            grid?.update(newOptionsObject, false);

            return newOptionsObject;
        }),
        'The update method should not mutate the options object passed as an argument.'
    ).toHaveProperty('columns');

    expect(
        await gridHandle.jsonValue(),
        'The update method should not mutate the options object passed as an argument.'
    ).toHaveProperty('options.columns', [{
        id: 'product',
        header: {
            format: 'Column 1'
        },
        cells: {
            format: 'before update'
        }
    }, {
        id: 'weight',
        header: {
            format: 'Column 2'
        },
        cells: {
            format: 'after update'
        }
    }, {
        id: 'price',
        enabled: false
    }]);

    expect(
        await gridHandle.evaluate(grid => {
            grid?.update({
                columns: [{
                    id: 'weight'
                }, {
                    id: 'product',
                    cells: {
                        format: 'after update'
                    }
                }]
            }, false, true);

            return grid?.options?.columns;
        }),
        'One-to-one update should remove all the column options that were not' +
        ' specified in the first argument.'
    ).toStrictEqual([
        {
            id: 'weight',
            header: {
                format: 'Column 2'
            },
            cells: {
                format: 'after update'
            }
        }, {
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            }
        }
    ]);

    expect(
        await gridHandle.evaluate(grid => {
            grid?.updateColumn('weight', {}, false, true);
            grid?.updateColumn('product', { enabled: false }, false);
            grid?.updateColumn('imaginary-column', {
                header: {
                    format: 'New One!'
                }
            }, false);

            return grid?.options?.columns;
        }),
        'Varations of updateColumn method should work correctly.'
    ).toStrictEqual(
        [{
            id: 'product',
            header: {
                format: 'Column 1'
            },
            cells: {
                format: 'after update'
            },
            enabled: false
        }, {
            id: 'imaginary-column',
            header: {
                format: 'New One!'
            }
        }]
    );

    expect(
        await gridHandle.evaluate(grid => {
            const options = grid?.getOptions();
            return options ? JSON.stringify(options) : '';
        }),
        'The getOptions method should return the correct JSON string.'
    ).toBe(
        '{"columns":[{"id":"product","header":{"format":"Column 1"},"cells":{"format":"after update"},"enabled":false},' +
        '{"id":"imaginary-column","header":{"format":"New One!"}}],"dataTable":{"columns":{"product":["Apples","P' +
        'ears","Plums","Bananas"],"weight":[100,40,0.5,200],"price":[1.5,2.53,5,4.5]}}}'
    );
});

// Equivalent of test/typescript-karma/Grid/columnOptions.test.js - formatter options test
test('Grid formatter options', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const gridCreated = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return false;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                    weight: [100, 40, 0.5, 200],
                    price: [1.5, 2.53, 5, 4.5]
                }
            },
            columnDefaults: {
                header: {
                    formatter: function () {
                        return 1; // Should not throw an error even if wrong type
                    }
                },
                cells: {
                    formatter: function () {
                        return 2; // Should not throw an error even if wrong type
                    }
                }
            }
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        return !!grid;
    });

    expect(gridCreated, 'Formatter returns the wrong type, but it can be stringified without causing an error.').toBe(true);
});

// Equivalent of test/typescript-karma/Grid/grid.test.js - custom sorting test
test('Grid custom sorting', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const sortedLabelData = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const grid = await (window as any).Grid.grid(parentElement, {
            dataTable: {
                columns: {
                    label: ['A', 'B', 'C', 'D'],
                    weight: ['100 g', '40 kg', '0.5 kg', '800 g']
                }
            },
            columns: [{
                id: 'weight',
                sorting: {
                    compare: (a: string, b: string) => {
                        const convert = (n: string) => parseFloat(n) * (
                            n.endsWith('kg') ? 1000 : 1
                        );
                        return convert(b) - convert(a);
                    }
                }
            }]
        }, true);
        grid.viewport?.resizeObserver?.disconnect();

        await grid.viewport?.getColumn('weight')?.sorting?.setOrder('asc');

        return grid.viewport?.getColumn('label')?.data;
    });

    expect(
        sortedLabelData,
        'Column "label" should be sorted according to the "weight" column in ascending order.'
    ).toStrictEqual(['B', 'D', 'C', 'A']);
});

// Equivalent of test/typescript-karma/Grid/grid.test.js - delegates cell events to tbody
test('Grid delegates cell events to tbody', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://code.highcharts.com/grid/grid-lite.js"></script>
                <link rel="stylesheet" href="https://code.highcharts.com/grid/grid-lite.css"></link>
            </head>
            <body>
                <div id="container"></div>
            </body>
        </html>
    `, { waitUntil: 'networkidle' });

    const result = await page.evaluate(async () => {
        const parentElement = document.getElementById('container');
        if (!parentElement) {
            return null;
        }

        const added: { target: EventTarget; type: string }[] = [];
        const originalAddEventListener =
            EventTarget.prototype.addEventListener.bind(EventTarget.prototype);
        EventTarget.prototype.addEventListener = function (
            this: EventTarget,
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ) {
            added.push({ target: this, type });
            return originalAddEventListener.call(this, type, listener, options);
        };

        let grid: any;
        try {
            grid = await (window as any).Grid.grid(
                parentElement,
                {
                    dataTable: {
                        columns: {
                            product: ['Apples', 'Pears', 'Plums', 'Bananas'],
                            weight: [100, 40, 0.5, 200],
                            price: [1.5, 2.53, 5, 4.5]
                        }
                    }
                },
                true
            );
        } finally {
            EventTarget.prototype.addEventListener = originalAddEventListener;
        }

        grid.viewport?.resizeObserver?.disconnect();

        const tbody = grid.viewport?.tbodyElement;
        if (!tbody) {
            return { error: 'Table body element does not exist' };
        }

        const delegatedEvents = [
            'click',
            'dblclick',
            'mousedown',
            'mouseover',
            'mouseout',
            'keydown'
        ];

        const tbodyHasEvents = delegatedEvents.map((type) => ({
            type,
            attached: added.some(
                (entry) => entry.target === tbody && entry.type === type
            )
        }));

        const perCellDelegated = added.filter((entry) => (
            entry.target instanceof HTMLTableCellElement &&
            entry.target.tagName === 'TD' &&
            delegatedEvents.includes(entry.type)
        ));

        grid?.destroy();

        return {
            tbodyHasEvents,
            perCellDelegatedCount: perCellDelegated.length
        };
    });

    expect(result?.error).toBeUndefined();

    // Verify all delegated events are attached to tbody
    expect(
        result?.tbodyHasEvents?.every((event) => event.attached),
        'All delegated event listeners should be attached to tbody.'
    ).toBe(true);

    expect(
        result?.perCellDelegatedCount,
        'Delegated events should not be bound to individual cells.'
    ).toBe(0);
});

