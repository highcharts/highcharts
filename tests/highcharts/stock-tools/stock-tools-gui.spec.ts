import { test, expect } from '~/fixtures.ts';

test('Disabling and enabling stock tools buttons, when series are invisible (#14192)',
    {
        annotation: [{
            type: 'qunit-sample',
            description: 'samples/unit-tests/stock-tools/gui'
        }]
    },
    async ({ page }) => {
        await page.setContent(`
<link rel="stylesheet" type="text/css" href="https://code.highcharts.com/css/stocktools/gui.css">
<link rel="stylesheet" type="text/css" href="https://code.highcharts.com/css/annotations/popup.css">

<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/stock/indicators/indicators-all.js"></script>
<script src="https://code.highcharts.com/stock/modules/annotations-advanced.js"></script>
<script src="https://code.highcharts.com/stock/modules/stock-tools.js"></script>

<div id="container"></div>`);

        const chart = await page.evaluateHandle<
            ReturnType<typeof Highcharts.chart>
        >(() => {
            const toolsContainer = document.createElement('div');
            const button = document.createElement('button');
            toolsContainer.className += 'tools-container';
            button.className += 'test-button';
            button.innerHTML = 'test button';
            toolsContainer.appendChild(button);

            document.getElementById('container').parentNode
                .insertBefore(toolsContainer, document.getElementById('container'));

            return Highcharts.stockChart('container', {
                stockTools: { gui: { enabled: false } },
                navigation: {
                    bindings: {
                        dummyButton: {
                            className: 'test-button',
                            init: function () {
                                const btn = document.querySelector<HTMLButtonElement>('.test-button');
                                btn.setAttribute('data-was-init-called', 'true');

                                Highcharts.fireEvent(this, 'deselectButton', { button: btn });
                            }
                        }
                    },
                    bindingsClassName: 'tools-container'
                }
            });
        });

        const buttonLocator = page.getByRole('button', { name: 'test button' });
        const clearFlag = async () =>
            buttonLocator.evaluate((btn: HTMLButtonElement) =>
                btn.removeAttribute('data-was-init-called')
            );

        await test.step('Init function should not be executed, when there is no series.', async () => {
            await buttonLocator.click();
            await expect(buttonLocator).not.toHaveAttribute('data-was-init-called');
        });

        await test.step('Init function should be executed, after series was added.', async () => {
            await chart.evaluate(c => {
                c.addSeries({ type: 'line', data: [1, 2, 3, 2, 3, 2] });
            });
            await clearFlag();
            await buttonLocator.click();
            await expect(buttonLocator).toHaveAttribute('data-was-init-called');
        });

        await test.step('Init function should not be called, when series are invisible.', async () => {
            await chart.evaluate(c => { c.series[0].setVisible(false); });
            await clearFlag();
            await buttonLocator.click();
            await expect(buttonLocator).not.toHaveAttribute('data-was-init-called');
        });

        await test.step('Init function should be called, when series are visible.', async () => {
            await chart.evaluate(c => { c.series[0].setVisible(true); });
            await clearFlag();
            await buttonLocator.click();
            await expect(buttonLocator).toHaveAttribute('data-was-init-called');
        });

        await test.step('Init function should not be called, after deleting the series.', async () => {
            await chart.evaluate(c => { c.series[0].remove(); });
            await clearFlag();
            await buttonLocator.click();
            await expect(buttonLocator).not.toHaveAttribute('data-was-init-called');
        });

        await test.step('Init function should be always called for button with alwaysVisible property defined.', async () => {
            await chart.evaluate(c => {
                c.addSeries({
                    type: 'line',
                    data: [1, 2, 3, 2, 3, 2]
                }, false);
                c.update({
                    navigation: {
                        bindings: {
                            dummyButton: {
                                className: 'test-button',
                                noDataState: 'normal',
                                init: function () {
                                    const btn = document.querySelector<HTMLButtonElement>('.test-button');
                                    btn?.setAttribute('data-was-init-called', 'true');
                                }
                            } as any
                        }
                    }
                }, false);
                c.series[0].setVisible(false, false);
                c.redraw();
            });
            await clearFlag();
            await buttonLocator.click();
            await expect(buttonLocator).toHaveAttribute('data-was-init-called');
        });
    });
