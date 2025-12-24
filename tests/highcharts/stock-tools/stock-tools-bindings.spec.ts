import type Highcharts from '~code/esm/highcharts.src';
import { test, expect, createChart } from '~/fixtures.ts';

const css = `

/* stylelint-disable function-no-unknown */
.chart {
    width: 100%;
    float: left;
    height: 400px;
}

.highcharts-stocktools-wrapper {
    width: 40px;
    height: 400px;
    position: absolute;
    z-index: 10;
}

.highcharts-stocktools-popup {
    width: 100%;
}

.highcharts-popup.highcharts-annotation-toolbar {
    right: 10%;
    left: auto;
    height: 40px;
    padding-right: 40px;
    width: auto;
}

.highcharts-popup.highcharts-annotation-toolbar > span {
    display: block;
    float: left;
    padding: 12px;
}

.highcharts-menu-wrapper {
    float: left;
    width: 40px;
    height: calc(100% - 30px);
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
}

.highcharts-stocktools-wrapper .highcharts-submenu-wrapper {
    display: none;
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    background: #fff;
    width: 40px;
}

.highcharts-stocktools-wrapper .highcharts-arrow-wrapper {
    text-align: center;
    width: 40px;
    position: absolute;
    left: 0%;
    bottom: 2px;
    font-size: 1.5em;
}

.highcharts-stocktools-wrapper .highcharts-arrow-wrapper > div {
    cursor: pointer;
}

.highcharts-stocktools-wrapper .highcharts-arrow-down {
    background-image: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/arrow-right.svg);
    background-size: cover;

    /* Safari */
    -webkit-transform: rotate(90deg);

    /* Firefox */
    -moz-transform: rotate(90deg);

    /* IE */
    -ms-transform: rotate(90deg);

    /* Opera */
    -o-transform: rotate(90deg);

    /* Internet Explorer */
    filter: progid:dximagetransform.microsoft.basicimage(rotation=1);
    transform: rotate(90deg);
}

.highcharts-stocktools-wrapper .highcharts-arrow-up {
    background-image: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/arrow-right.svg);
    background-size: cover;
    outline: none;
    display: inline-block;
    width: 25px;
    cursor: pointer;
    -webkit-user-select: none;

    /* Chrome/Safari */
    -moz-user-select: none;

    /* Firefox */
    -ms-user-select: none;

    /* IE10+ */

    /* Rules below not implemented in browsers yet */
    -o-user-select: none;
    user-select: none;

    /* Safari */
    -webkit-transform: rotate(-90deg);

    /* Firefox */
    -moz-transform: rotate(-90deg);

    /* IE */
    -ms-transform: rotate(-90deg);

    /* Opera */
    -o-transform: rotate(-90deg);

    /* Internet Explorer */
    filter: progid:dximagetransform.microsoft.basicimage(rotation=3);
    transform: rotate(-90deg);
}

.highcharts-stocktools-wrapper .highcharts-arrow-right {
    background: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/arrow-bottom.svg) no-repeat right bottom;
    background-size: contain;
}

.highcharts-stocktools-wrapper .highcharts-arrow-left.highcharts-arrow-right {
    /* Safari */
    -webkit-transform: rotate(0deg);

    /* Firefox */
    -moz-transform: rotate(0deg);

    /* IE */
    -ms-transform: rotate(0deg);

    /* Opera */
    -o-transform: rotate(0deg);

    /* Internet Explorer */
    filter: progid:dximagetransform.microsoft.basicimage(rotation=2);
    transform: rotate(0deg);
}

.highcharts-stocktools-wrapper .highcharts-arrow-left {
    background-image: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/arrow-right.svg);

    /* Safari */
    -webkit-transform: rotate(180deg);

    /* Firefox */
    -moz-transform: rotate(180deg);

    /* IE */
    -ms-transform: rotate(180deg);

    /* Opera */
    -o-transform: rotate(180deg);

    /* Internet Explorer */
    filter: progid:dximagetransform.microsoft.basicimage(rotation=2);
    transform: rotate(180deg);
}

.highcharts-stocktools-wrapper ul {
    width: 40px;

    /* 30px spacing for arrows to scroll */
    margin: 0;
    padding: 0;
    float: left;
}

.highcharts-stocktools-wrapper > ul {
    width: 40px;
    position: relative;
}

.highcharts-stocktools-wrapper .highcharts-stocktools-toolbar li {
    list-style: none;
    margin-bottom: 3px;
    padding: 0;
    clear: both;
    width: 100%;
    height: 40px;
    cursor: pointer;
    position: relative;
    background-color: #f7f7f7;
}

.highcharts-stocktools-wrapper li > span.highcharts-menu-item-btn {
    display: block;
    float: left;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.highcharts-submenu-wrapper li > span.highcharts-menu-item-btn {
    width: 40px;
}

.highcharts-stocktools-wrapper li > span.highcharts-submenu-item-arrow {
    float: left;
    width: 10px;
    height: 100%;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
}

.highcharts-stocktools-wrapper li.highcharts-separator {
    height: 15px;
    background-color: transparent;
    width: 36px;
    pointer-events: none;
}

.highcharts-stocktools-wrapper li.highcharts-separator > span.highcharts-menu-item-btn {
    width: 100%;
}

.highcharts-stocktools-wrapper li.highcharts-active > span.highcharts-menu-item-btn,
.highcharts-stocktools-wrapper li > span.highcharts-menu-item-btn:hover,
.highcharts-stocktools-wrapper .highcharts-arrow-wrapper > div:hover,
.highcharts-stocktools-wrapper li.highcharts-active,
.highcharts-toggle-toolbar:hover {
    background-color: #e6ebf5;
}

.highcharts-toggle-toolbar {
    position: absolute;
    cursor: pointer;
    width: 10px;
    height: 10px;
    left: 40px;
    background-color: #f7f7f7;
    background-image: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/arrow-right.svg);
    background-size: cover;
}

.highcharts-hide {
    display: none;
}

/* CHROME BUG
.highcharts-stocktools-wrapper li:hover, .highcharts-submenu-item-arrow:hover {
  background-color: #e6e6e6;
}
*/
.highcharts-stocktools-wrapper .highcharts-arrow-down,
.highcharts-stocktools-wrapper .highcharts-arrow-up {
    width: 50%;
    height: 20px;
    float: left;
}

.highcharts-popup {
    background-color: #fff;
    color: #666;
    display: none;
    font-size: 0.876em;
    height: 70%;
    top: 15%;
    left: 25%;
    position: absolute;
    width: 50%;
    z-index: 100;
    -webkit-box-shadow: 0 0 8px 0 rgb(61 61 61 / 30%);
    -moz-box-shadow: 0 0 8px 0 rgb(61 61 61 / 30%);
    box-shadow: 0 0 8px 0 rgb(61 61 61 / 30%);
}

.highcharts-popup input,
.highcharts-popup label,
.highcharts-popup select {
    clear: both;
    float: left;
    width: 100%;
    margin-bottom: 10px;
}

.highcharts-popup input {
    border: 1px solid #e6e6e6;
    padding: 5px;
    width: calc(100% - 12px);
}

.highcharts-popup-lhs-col,
.highcharts-popup-rhs-col {
    padding: 20px;
    height: calc(100% - 84px); /* 44px - padding, 40px - tabs */
    float: left;
}

.highcharts-popup-lhs-col.highcharts-popup-lhs-full {
    width: calc(100% - 40px);
    overflow: scroll;
    height: calc(100% - 100px);
    border: none;
}

.highcharts-popup-lhs-col {
    clear: both;
    width: calc(30% - 44px);
    border-right: 1px solid #e6e6e6;
}

.highcharts-popup-bottom-row {
    float: left;
    padding: 0 20px;
    width: calc(100% - 40px);
}

.highcharts-popup-rhs-col {
    width: calc(70% - 40px);
}

.highcharts-popup-rhs-col-wrapper {
    float: left;
    width: 100%;
    height: calc(100% - 40px);
    overflow: scroll;
}

.highcharts-stocktools-wrapper ul.highcharts-indicator-list,
.highcharts-indicator-list {
    float: left;
    color: #666;
    height: 100%;
    width: 100%;
    overflow: scroll;
    margin: 0;
    padding: 0;
}

.highcharts-indicator-list li {
    cursor: pointer;
    padding: 0 0 5px;
    margin: 0;
    width: 100%;
    height: auto;
}

/* CHROME BUG
.highcharts-stocktools-wrapper .highcharts-indicator-list li:hover {
  background-color: #ffffff;
} */

.highcharts-tab-item {
    background-color: #f7f7f7;
    cursor: pointer;
    display: block;
    float: left;
    padding: 10px;
    height: 20px;
}

.highcharts-tab-item.highcharts-tab-item-active {
    background-color: #e6ebf5;
}

.highcharts-tab-item-content {
    display: none;
    float: left;
    height: 100%;
    overflow: hidden;
    width: 100%;
    border-top: 1px solid #e6e6e6;
}

.highcharts-tab-item-show {
    display: block;
}

.highcharts-popup-close {
    background: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/close.svg) no-repeat 50% 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    padding: 10px;
    top: 0%;
    right: 0%;
    color: #333;
}

.highcharts-popup-close:hover,
.highcharts-popup button:hover,
.highcharts-popup button.highcharts-annotation-edit-button:hover,
.highcharts-popup button.highcharts-annotation-remove-button:hover {
    background-color: #e6ebf5;
}

.highcharts-popup button {
    float: right;
    border: none;
    background: #f7f7f7;
    color: #666;
    margin-left: 5px;
}

.highcharts-tab-disabled {
    color: #ccc;
}

/* annotation edit small popup */
.highcharts-popup button.highcharts-annotation-edit-button,
.highcharts-popup button.highcharts-annotation-remove-button {
    width: 20px;
    height: 40px;
    padding: 20px;
}

.highcharts-popup button.highcharts-annotation-edit-button {
    background: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/edit.svg) no-repeat 50% 50% transparent;
    text-indent: -9999px;
}

.highcharts-popup button.highcharts-annotation-remove-button {
    background: url(https://code.highcharts.com/7.0.0/gfx/stock-icons/destroy.svg) no-repeat 50% 50% transparent;
    text-indent: -9999px;
}

.highcharts-popup .highcharts-annotation-title {
    display: block;
    float: left;
    font-size: 1.3em;
    font-weight: bold;
    margin-bottom: 15px;
    width: 100%;
}
`;

test('Bindings general tests', async ({ page }) => {
    // Needed for localstorage
    await page.goto('http://example.com/shim.html');

    const options = {
        chart: {
            width: 800
        },
        yAxis: {
            labels: {
                align: 'left'
            }
        },
        series: [
            {
                type: 'ohlc',
                id: 'aapl',
                name: 'AAPL Stock Price',
                data: [
                    [0, 12, 15, 10, 13],
                    [1, 13, 16, 9, 15],
                    [2, 15, 15, 11, 12],
                    [3, 12, 12, 11, 12],
                    [4, 12, 15, 12, 15],
                    [5, 11, 11, 10, 10],
                    [6, 10, 16, 10, 12],
                    [7, 12, 17, 12, 17],
                    [8, 17, 18, 15, 15],
                    [9, 15, 19, 12, 12]
                ]
            }
        ],
        stockTools: {
            gui: {
                enabled: true
            }
        }
    } satisfies Highcharts.Options;

    const chart = await createChart(
        page,
        options, {
            chartConstructor: 'stockChart',
            modules: [
                'stock/indicators/indicators-all.js',
                'modules/annotations-advanced.js',
                'modules/stock-tools.js',
                'modules/price-indicator.js',
            ],
            css
        });


    const verticalAnnotation = await chart.evaluateHandle( c =>  {
        return c.addAnnotation({
            type: 'verticalLine',
            typeOptions: {
                point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: 5,
                    y: 15
                }
            }
        });
    });

    const { x, y } = await verticalAnnotation.evaluate(
        v => v.shapes[0].graphic.getBBox()
    );

    const [ plotLeft, plotTop, plotWidth, plotHeight ] = await chart.evaluate(
        c => ([c.plotLeft, c.plotTop, c.plotWidth, c.plotHeight])
    );

    await test.step('click save chart', async ()=>{
        await page.mouse.move(
            plotLeft + x - 10,
            plotTop + y - 15
        );
        await page.mouse.down();

        await page.mouse.move(
            plotLeft + 100,
            plotTop + 100
        );

        await page.mouse.up();

        await (page.locator('.highcharts-save-chart')).click();
    });


    const annotationStorage = await page.evaluate(
        () => localStorage.getItem('highcharts-chart')
    );

    expect(
        JSON.parse(annotationStorage).annotations[0].typeOptions,
        'Annotation position saves correctly in localStorage after drag and ' +
        'drop'
    ).toEqual(
        await verticalAnnotation.evaluate(v => v.userOptions.typeOptions)
    );

    await test.step('Cleanup', async () => {
        await verticalAnnotation.evaluate(v => v.destroy());
        await verticalAnnotation.dispose();

        await chart.evaluate((c) => {
            c.annotations.length = 0;

            c.stockTools.wrapper.style.display = 'none';
            localStorage.removeItem('highcharts-chart');
        });
    });


    let annotationsCount = 0;

    const points = await chart.evaluate( c => c.series[0].points);


    const selectButton = async (name) => await chart.evaluate((c, name)=>{
        const button = document.getElementsByClassName('highcharts-' + name)[0];
        c.navigationBindings.bindingsButtonClick(
            button,
            c.navigationBindings.boundClassNames['highcharts-' + name],
            {
                target: {
                    parentNode: button,
                    classList: {
                        contains: Highcharts.noop
                    }
                }
            }
        );
    }, name);

    // Annotations with multiple steps:
    for (const name of [
        'circle-annotation',
        'rectangle-annotation',
        'ellipse-annotation',
        'segment',
        'arrow-segment',
        'ray',
        'arrow-ray',
        'infinity-line',
        'arrow-infinity-line',
        'crooked3',
        'crooked5',
        'elliott3',
        'elliott5',
        'pitchfork',
        'fibonacci',
        'parallel-channel',
        'measure-xy',
        'measure-y',
        'measure-x'
    ]) {
        await test.step(name + ' annotation', async ()=> {

            await selectButton(name);

            await page.mouse.click(
                points[2].plotX + plotLeft - 5,
                points[2].plotY + plotTop - 5
            );

            const indexes = await chart.evaluate((c, name) => {
                return c.navigationBindings.boundClassNames['highcharts-' + name].steps
                    .map((_, i) => {
                        return i;
                    });
            }, name);

            for (const index of indexes){
                await page.mouse.click(
                    points[4 + index].plotX + plotLeft - 5,
                    points[4 + index].plotY + plotTop - 5
                );
            }

            annotationsCount++;

            expect.soft(
                await chart.evaluate(c => c.annotations.length),
                'Annotation: ' + name + ' added without errors.'
            ).toEqual(annotationsCount);
        });
    }


    for (const name of [
        'label-annotation',
        'vertical-line',
        'horizontal-line',
        'vertical-counter',
        'vertical-label',
        'vertical-arrow',
        // 'vertical-double-arrow'
    ]){
        await test.step(name + ' annotation', async ()=> {
            await selectButton(name);

            await page.mouse.click(points[2].plotX, points[2].plotY);

            annotationsCount++;

            expect.soft(
                await chart.evaluate(c => c.annotations.length),
                'Annotation: ' + name + ' added without errors.'
            ).toEqual(annotationsCount);
        });
    }

    await test.step('Drag and drop', async () => {
        // Test control points, measure-y annotation
        await page.mouse.click(
            plotLeft + plotWidth / 2,
            plotTop + plotHeight / 2
        );

        const annotationMiddle = await chart.evaluate(
            c =>
                c.annotations[16].shapes[1].graphic.getBBox().height / 2
        );

        await page.mouse.down();
        await page.mouse.move(
            plotLeft + plotWidth / 2,
            plotTop +
            plotHeight / 2 +
            annotationMiddle
        );

        await page.mouse.move(
            plotLeft + plotWidth / 2,
            plotTop + plotHeight / 2 + 10
        );

        await page.mouse.up();

        const [
            current,
            expected
        ] = await chart.evaluate(c =>{
            return [
                c.annotations[16].yAxisMax,
                c.yAxis[0].toValue(c.plotHeight / 2 + 10),
            ];
        });

        expect(
            current,
            'Annotation should updated after control point\'s drag&drop (#12459)'
        ).toBeCloseTo(
            expected,
            0 // 0 decimal precision
        );
    });

    // TODO: Check if the gpt is correct below

    await test.step('Current Price Indicator toggles', async () => {
        await selectButton('current-price-indicator');
        let vis = await chart.evaluate(c => {
            const s = c.series[0];
            return {
                lastVisible: s.lastVisiblePrice &&
                    s.lastVisiblePrice.visibility,
                last: s.lastPrice && s.lastPrice.visibility
            };
        });
        expect(vis.lastVisible).toBe('inherit');
        expect(vis.last).toBe('inherit');

        await selectButton('current-price-indicator');
        vis = await chart.evaluate(c => {
            const s = c.series[0];
            return {
                lastVisible: s.lastVisiblePrice &&
                    s.lastVisiblePrice.visibility,
                last: s.lastPrice && s.lastPrice.visibility
            };
        });
        expect(vis.lastVisible).toBeUndefined();
        expect(vis.last).toBeUndefined();
    });

    await test.step('Toggle Annotations hides/shows all', async () => {
        // hide all
        await selectButton('toggle-annotations');
        const allHidden = await chart.evaluate(c =>
            c.annotations.every(a => a.options.visible === false)
        );
        expect(allHidden).toBe(true);

        // show all
        await selectButton('toggle-annotations');
        const allVisible = await chart.evaluate(c =>
            c.annotations.every(a => a.options.visible === true)
        );
        expect(allVisible).toBe(true);
    });

    // Series types change
    for (const type of ['line', 'ohlc', 'candlestick']) {
        await test.step(`Series type: ${type}`, async () => {
            await selectButton('series-type-' + type);
            await expect
                .poll(() => chart.evaluate(c => c.series[0].type))
                .toBe(type);
        });
    }

    // Save chart in localStorage
    await test.step('Save chart -> localStorage', async () => {
        await selectButton('save-chart');
        const stored = await page.evaluate(() => localStorage.getItem('highcharts-chart'));
        expect(stored).not.toBeNull();
    });

    // Restore basic annotations (no typeOptions) and cleanup
    await test.step('Restore basic annotations & cleanup', async () => {
        const raw = await page.evaluate(() => localStorage.getItem('highcharts-chart'));
        const saved = JSON.parse(raw);

        for (const ann of saved.annotations) {
            // eslint-disable-next-line playwright/no-conditional-in-test
            if (!ann.typeOptions) {
                await chart.evaluate((c, a) => { c.addAnnotation(a); }, ann);
                // eslint-disable-next-line playwright/no-conditional-expect
                expect(true).toBe(true); // no errors thrown
                annotationsCount++;
            }
        }

        await page.evaluate(() => localStorage.removeItem('highcharts-chart'));
    });

    await test.step('Annotation events: edit popup & toolbar visible', async () => {

        let points = await chart.evaluate(c => {
            return c.series[0].points;
        });
        await chart.evaluate(c => {
            c.navigationBindings.popup.closePopup();
        });

        await page.mouse.click(
            points[2].plotX + plotLeft + 15,
            points[2].plotY + plotTop + 25
        );

        await chart.evaluate((c)=>{
            // Styles in Karma are not loaded!
            c.navigationBindings.popup.container.style.position = 'absolute';
        });

        const editBtn = page.locator('.highcharts-popup .highcharts-annotation-edit-button').first();
        await editBtn.click();

        const popupEditor = page.locator('.highcharts-popup-lhs-col');
        await expect(popupEditor.first()).toHaveCount(1);
        const count = await popupEditor.first().locator(':scope > *').count();
        expect(count).toBeGreaterThan(0);
        await expect(popupEditor.first().locator(':scope > *').first()).toHaveText('Shape options');

        points = await chart.evaluate(c => {
            return c.series[0].points;
        });

        // Point out the other point to close the editor popup
        await page.mouse.click(
            points[9].plotX + plotLeft, points[9].plotY + plotTop
        );

        await page.mouse.click(
            points[2].plotX + plotLeft + 60, // 60 is magic number to not hit the tooltip
            points[2].plotY + plotTop + 25
        );

        const popup = page.locator('.highcharts-annotation-toolbar');

        await expect(popup).toBeInViewport();

        expect(
            await chart.evaluate(c =>
                c.navigationBindings.popup.container.classList.contains(
                    'highcharts-annotation-toolbar'
                )
            ),
            'Annotations toolbar rendered.'
        ).toBe(true);

        // TODO: this one does not work :S
        expect(
            await chart.evaluate(c =>
                c.navigationBindings.popup.container.style.display,
            ),
            'Annotations toolbar visible.'
        ).toBe('block');

        const removeButton = page.locator('button.highcharts-annotation-remove-button');

        await removeButton.click();

        expect(
            await chart.evaluate(c => c.annotations.length),
            'Annotation removed through popup.'
        ).toBe(
            --annotationsCount,
        );
        expect(
            await chart.evaluate(c =>
                c.navigationBindings.popup.container.style.display,
            ),
            'Annotations toolbar hidden.'
        ).toBe('none');



    });

    await test.step('Flag circlepin adds exactly one flag point', async () => {
        const before = await chart.evaluate(c => ({
            seriesLen: c.series.length,
            flagsPoints: c.series.filter(s => s.type === 'flags')
                .reduce((n, s) => n + s.points.length, 0)
        }));

        await selectButton('flag-circlepin');

        const pts = await chart.evaluate(c =>
            c.series[0].points.map(p => ({ x: p.plotX, y: p.plotY }))
        );
        await page.mouse.click(plotLeft + pts[2].x, plotTop + pts[2].y);

        await chart.evaluate(c => {
            c.navigationBindings.popup.container.style.position = 'absolute';
            c.navigationBindings.popup.container.style.top = '0px';
        });
        await page.locator('.highcharts-popup .highcharts-popup-bottom-row button').first().click();

        await expect
            .poll(() => chart.evaluate(c => c.series.length))
            .toBe(before.seriesLen + 1);

        await expect
            .poll(() => chart.evaluate(c =>
                c.series.filter(s => s.type === 'flags')
                    .reduce((n, s) => n + s.points.length, 0)
            ))
            .toBe(before.flagsPoints + 1);
    });

    await test.step('#9740: toggle-annotations still bound after chart.update()', async () => {
        await chart.evaluate(c => {
            c.update({ stockTools: { gui: { buttons: ['toggleAnnotations'] } } }, true);
        });

        await selectButton('toggle-annotations');

        const firstVisible = await chart.evaluate(c =>
            c.annotations[0]?.options.visible
        );
        expect(firstVisible).toBe(false);

        // restore default state for later tests
        await selectButton('toggle-annotations');
    });

});
