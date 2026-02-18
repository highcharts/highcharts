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
                            topIds: []
                        }
                    }
                },
                events: {
                    beforeRowPinningChange(e: any): void {
                        output.push({
                            type: 'before',
                            action: e.action,
                            rowId: e.rowId,
                            topIds: e.topIds.slice(),
                            bottomIds: e.bottomIds.slice(),
                            previousTopIds: e.previousTopIds.slice(),
                            previousBottomIds: e.previousBottomIds.slice(),
                            changed: e.changed
                        });
                    },
                    afterRowPinningChange(e: any): void {
                        output.push({
                            type: 'after',
                            action: e.action,
                            rowId: e.rowId,
                            topIds: e.topIds.slice(),
                            bottomIds: e.bottomIds.slice(),
                            previousTopIds: e.previousTopIds.slice(),
                            previousBottomIds: e.previousBottomIds.slice(),
                            changed: e.changed
                        });
                    }
                }
            });

            await grid.pinRow('B', 'top');
            await grid.toggleRow('B');
            await grid.pinRow('C', 'bottom');

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
    });

    test('does not fire events when pinning is disabled', async ({ page }) => {
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
                            bottomIds: ['C']
                        }
                    }
                },
                events: {
                    beforeRowPinningChange(): void {
                        output.push('before');
                    },
                    afterRowPinningChange(): void {
                        output.push('after');
                    }
                }
            });

            await grid.pinRow('B', 'top');
            await grid.toggleRow('C');
            await grid.unpinRow('A');

            const pinned = grid.getPinnedRows();
            const rowPinningMeta = grid.rowPinningMeta || null;

            grid.destroy();
            container.remove();

            return {
                output,
                pinned,
                rowPinningMeta
            };
        });

        expect(state.output).toEqual([]);
        expect(state.pinned.topIds).toEqual([]);
        expect(state.pinned.bottomIds).toEqual([]);
        expect(state.rowPinningMeta).toBeNull();
    });
});
