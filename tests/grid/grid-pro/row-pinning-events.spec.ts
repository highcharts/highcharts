import { test, expect } from '~/fixtures.ts';

test.describe('Grid Pro row pinning events', () => {
    test('fires before/after events in order with payload', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        const events = await page.evaluate(async () => {
            const output: Array<{
                type: 'before'|'after';
                action: 'pin'|'unpin'|'toggle';
                rowId: string|number;
                topIds: Array<string|number>;
                bottomIds: Array<string|number>;
                previousTopIds: Array<string|number>;
                previousBottomIds: Array<string|number>;
                changed: boolean;
                targetMatchesGrid: boolean;
            }> = [];

            const container = document.createElement('div');
            container.id = 'pinning-events-test';
            container.style.width = '800px';
            container.style.height = '320px';
            document.body.appendChild(container);

            const grid = (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['A', 'B', 'C'],
                        value: [1, 2, 3]
                    }
                },
                rendering: {
                    rows: {
                        pinning: {
                            idColumn: 'id',
                            topIds: [],
                            events: {
                                beforeRowPin(e: any): void {
                                    output.push({
                                        type: 'before',
                                        action: e.action,
                                        rowId: e.rowId,
                                        topIds: e.topIds.slice(),
                                        bottomIds: e.bottomIds.slice(),
                                        previousTopIds:
                                            e.previousTopIds.slice(),
                                        previousBottomIds:
                                            e.previousBottomIds.slice(),
                                        changed: e.changed,
                                        targetMatchesGrid: e.target === grid
                                    });
                                },
                                afterRowPin(e: any): void {
                                    output.push({
                                        type: 'after',
                                        action: e.action,
                                        rowId: e.rowId,
                                        topIds: e.topIds.slice(),
                                        bottomIds: e.bottomIds.slice(),
                                        previousTopIds:
                                            e.previousTopIds.slice(),
                                        previousBottomIds:
                                            e.previousBottomIds.slice(),
                                        changed: e.changed,
                                        targetMatchesGrid: e.target === grid
                                    });
                                }
                            }
                        }
                    }
                }
            });

            await grid.rowPinning.pin('B', 'top');
            await grid.rowPinning.toggle('B');
            await grid.rowPinning.pin('C', 'bottom');

            grid.destroy();
            container.remove();

            return output;
        });

        expect(events.map((e) => e.type)).toEqual([
            'before', 'after',
            'before', 'after',
            'before', 'after'
        ]);
        expect(events.map((e) => e.action)).toEqual([
            'pin', 'pin',
            'toggle', 'toggle',
            'pin', 'pin'
        ]);

        expect(events[0].topIds).toEqual(['B']);
        expect(events[0].previousTopIds).toEqual([]);
        expect(events[1].topIds).toEqual(['B']);

        expect(events[2].topIds).toEqual([]);
        expect(events[2].previousTopIds).toEqual(['B']);
        expect(events[3].topIds).toEqual([]);

        expect(events[4].bottomIds).toEqual(['C']);
        expect(events[4].previousBottomIds).toEqual([]);
        expect(events[5].bottomIds).toEqual(['C']);

        expect(events.every((e) => e.changed === true)).toBe(true);
        expect(events.every((e) => e.targetMatchesGrid)).toBe(true);
    });

    test('beforeRowPin fires before state changes', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        const result = await page.evaluate(async () => {
            const snapshots: Array<{
                type: 'before'|'after';
                action: string;
                pinnedAtCallTime: {
                    topIds: Array<string|number>;
                    bottomIds: Array<string|number>;
                };
            }> = [];

            function makeGrid(): { grid: any; container: HTMLElement } {
                const container = document.createElement('div');
                container.style.width = '800px';
                container.style.height = '320px';
                document.body.appendChild(container);

                const grid = (window as any).Grid.grid(container, {
                    dataTable: {
                        columns: {
                            id: ['A', 'B', 'C'],
                            value: [1, 2, 3]
                        }
                    },
                    rendering: {
                        rows: {
                            pinning: {
                                idColumn: 'id',
                                topIds: [],
                                events: {
                                    beforeRowPin(e: any): void {
                                        const pinned =
                                            this.rowPinning.getPinnedRows();
                                        snapshots.push({
                                            type: 'before',
                                            action: e.action,
                                            pinnedAtCallTime: {
                                                topIds:
                                                    pinned.topIds.slice(),
                                                bottomIds:
                                                    pinned.bottomIds.slice()
                                            }
                                        });
                                    },
                                    afterRowPin(e: any): void {
                                        const pinned =
                                            this.rowPinning.getPinnedRows();
                                        snapshots.push({
                                            type: 'after',
                                            action: e.action,
                                            pinnedAtCallTime: {
                                                topIds:
                                                    pinned.topIds.slice(),
                                                bottomIds:
                                                    pinned.bottomIds.slice()
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                });

                return { grid, container };
            }

            // Test pin: use a fresh grid to avoid re-render
            // interaction from previous operations.
            const { grid: g1, container: c1 } = makeGrid();
            await g1.rowPinning.pin('B', 'top');
            g1.destroy();
            c1.remove();

            // Test unpin: fresh grid with A pre-pinned, then
            // unpin. Discard pin events.
            const { grid: g2, container: c2 } = makeGrid();
            await g2.rowPinning.pin('A', 'top');
            snapshots.length = 2; // keep only pin snapshots
            await g2.rowPinning.unpin('A');
            g2.destroy();
            c2.remove();

            // Test toggle: fresh grid.
            const { grid: g3, container: c3 } = makeGrid();
            await g3.rowPinning.toggle('C', 'bottom');
            g3.destroy();
            c3.remove();

            return snapshots;
        });

        // pin: before event should see empty state
        expect(result[0].type).toBe('before');
        expect(result[0].action).toBe('pin');
        expect(result[0].pinnedAtCallTime.topIds).toEqual([]);

        // pin: after event should see pinned state
        expect(result[1].type).toBe('after');
        expect(result[1].action).toBe('pin');
        expect(result[1].pinnedAtCallTime.topIds).toEqual(['B']);

        // unpin: before event should still see A pinned
        expect(result[2].type).toBe('before');
        expect(result[2].action).toBe('unpin');
        expect(result[2].pinnedAtCallTime.topIds).toEqual(['A']);

        // unpin: after event should see empty state
        expect(result[3].type).toBe('after');
        expect(result[3].action).toBe('unpin');
        expect(result[3].pinnedAtCallTime.topIds).toEqual([]);

        // toggle: before event should see empty state
        expect(result[4].type).toBe('before');
        expect(result[4].action).toBe('toggle');
        expect(result[4].pinnedAtCallTime.bottomIds).toEqual([]);

        // toggle: after event should see C pinned bottom
        expect(result[5].type).toBe('after');
        expect(result[5].action).toBe('toggle');
        expect(result[5].pinnedAtCallTime.bottomIds).toEqual(['C']);
    });

    test('fires events when pinning UI is disabled', async ({ page }) => {
        await page.goto('/grid-pro/basic/overview', {
            waitUntil: 'networkidle'
        });

        const state = await page.evaluate(async () => {
            const output: Array<string> = [];

            const container = document.createElement('div');
            container.id = 'pinning-events-disabled-test';
            container.style.width = '800px';
            container.style.height = '320px';
            document.body.appendChild(container);

            const grid = (window as any).Grid.grid(container, {
                dataTable: {
                    columns: {
                        id: ['A', 'B', 'C'],
                        value: [1, 2, 3]
                    }
                },
                rendering: {
                    rows: {
                        pinning: {
                            enabled: false,
                            idColumn: 'id',
                            topIds: ['A'],
                            bottomIds: ['C'],
                            events: {
                                beforeRowPin(): void {
                                    output.push('before');
                                },
                                afterRowPin(): void {
                                    output.push('after');
                                }
                            }
                        }
                    }
                }
            });

            const initialPinned = grid.rowPinning.getPinnedRows();
            await grid.rowPinning.pin('B', 'top');
            await grid.rowPinning.toggle('C');
            await grid.rowPinning.unpin('A');

            const pinned = grid.rowPinning.getPinnedRows();

            grid.destroy();
            container.remove();

            return {
                initialPinned,
                output,
                pinned
            };
        });

        expect(state.initialPinned.topIds).toEqual(['A']);
        expect(state.initialPinned.bottomIds).toEqual(['C']);
        expect(state.output).toEqual([
            'before',
            'after',
            'before',
            'after',
            'before',
            'after'
        ]);
        expect(state.pinned.topIds).toEqual(['B']);
        expect(state.pinned.bottomIds).toEqual([]);
    });
});
