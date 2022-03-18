
// describe('Adding custom indicator on a separate axis through indicator popup, #15804.', () => {
//     beforeEach(() => {
//         cy.viewport(1000, 500);
//     });

//     before(() => {
//         cy.visit('/stock/demo/stock-tools-gui');
//     });

//     it('#15730: Should close popup after hiding annotation', () => {
//         // Add custom indicator which should use another axis.
//         cy.window().then((win) => {
//             const H = win.Highcharts,
//                 bindingsUtils = H._modules['Extensions/Annotations/NavigationBindings.js'].prototype.utils;

//             H.seriesType(
//                 'customIndicatorBasedOnRSI',
//                 'rsi', {
//                 name: 'Custom Indicator',
//                 color: 'red'
//                 }, {

//                 }
//             );
//             bindingsUtils.indicatorsWithAxes.push('customIndicatorBasedOnRSI');
//         });

//         cy.openIndicators()
//         cy.get('.highcharts-indicator-list')
//             .contains('CUSTOMINDICATORBASEDONRSI')
//             .click();
//         cy.addIndicator();

//         cy.chart().should(chart =>
//             assert.strictEqual(
//                 chart.yAxis.length,
//                 4,
//                 `After adding a custom indicator that is based on other oscillators,
//                 another axis should be added.`
//             )
//         );
//     });
// });

describe('Axis height recalculation.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Axes should scale after removing indicators through Stock Tools GUI, #15735.', () => {
        const addATR = function(period) {
            cy.openIndicators()
            cy.get('.highcharts-indicator-list')
                .contains('ATR')
                .click()
            cy.get('input[name="highcharts-atr-period"]')
                .eq(0)
                .clear()
                .type(period);
            cy.addIndicator();
        }

        addATR(20);
        addATR(25);
        addATR(30);
        addATR(35);
        addATR(45);

        cy.chart().should(chart =>{
            // Exclude 2 first axes and navigator axis.
            const yAxis = chart.yAxis;

            for(let i = 3; i < chart.yAxis.length - 1; i++) {
                assert.closeTo(
                    yAxis[i].top + yAxis[i].height,
                    yAxis[i + 1].top,
                    1,
                    `The end of the ${i + 1} axis should be close to beginning of the ${i + 2} axis.`
                )
            }
        });
        cy.openIndicators()
        cy.get('.highcharts-tab-item')
            .eq(1)
            .click(); // Open EDIT bookmark.
        cy.get('.highcharts-indicator-list')
            .contains('ATR (35)')
            .click();
        cy.get('.highcharts-popup-rhs-col')
            .children('.highcharts-popup button')
            .eq(2)
            .click(); // Remove that indicator.

        cy.chart().should(chart =>{
            // Exclude 2 first axes and navigator axis.
            const yAxis = chart.yAxis;

            for(let i = 3; i < chart.yAxis.length - 1; i++) {
                assert.closeTo(
                    yAxis[i].top + yAxis[i].height,
                    yAxis[i + 1].top,
                    1,
                    `The end of the ${i + 1} axis should be close to beginning of the ${i + 2} axis.`
                )
            }
        });
    });
});