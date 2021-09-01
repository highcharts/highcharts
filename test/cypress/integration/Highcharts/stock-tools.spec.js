describe('Stock Tools', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('#15730: Should close popup after hiding annotation', () => {
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-container').click();
        cy.chart().should(chart =>
            assert.strictEqual(chart.annotations.length, 1)
        );
        cy.get('.highcharts-annotation').click();
        cy.get('.highcharts-popup').should('be.visible');
        cy.get('.highcharts-toggle-annotations').click();
        cy.get('.highcharts-popup').should('be.hidden');
        cy.get('.highcharts-toggle-annotations').click();
    });

    it('#15729: Should keep annotation selected after dragging', () => {
        cy.get('.highcharts-annotation')
            .click()
            .dragTo('.highcharts-container', 300, 100);
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15729: Should keep annotation selected after dragging control point', () => {
        cy.get('.highcharts-control-points')
            .children()
            .first()
            .dragTo('.highcharts-container', 600, 200);
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15725: Should use the same axis for all points in multi-step annotation', () => {
        cy.get('.highcharts-elliott3').first().click();
        cy.get('.highcharts-container')
            .click(100, 210)
            .click(120, 260)
            .click(140, 210)
            .click(160, 260);
        cy.chart().should(chart =>
            chart.annotations[1].points.forEach(point =>
                assert.ok(point.y > -50 && point.y < 50)
            )
        );
    });

    it('#16158: Should use correct default series in popup', () => {
        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-indicator-list').contains('Accumulation').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should('have.value', 'aapl-ohlc');
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should('have.value', 'aapl-volume');
        cy.get('.highcharts-popup-rhs-col button').contains('add').click();

        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-tab-item').contains('edit').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should('have.value', 'aapl-ohlc');
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should('have.value', 'aapl-volume');
        cy.get('.highcharts-popup-rhs-col button').contains('save').click();
    });
});

describe('Adding custom indicator on a separate axis through indicator popup, #15804.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('#15730: Should close popup after hiding annotation', () => {
        // Add custom indicator which should use another axis.
        cy.window().then((win) => {
            const H = win.Highcharts,
                bindingsUtils = H._modules['Extensions/Annotations/NavigationBindings.js'].prototype.utils;
            
            H.seriesType(
                'customIndicatorBasedOnRSI',
                'rsi', {
                name: 'Custom Indicator',
                color: 'red'
                }, {

                }
            );
            bindingsUtils.indicatorsWithAxes.push('customIndicatorBasedOnRSI');
        });

        cy.get('.highcharts-indicators')
            .click();

        cy.get('.highcharts-indicator-list')
            .contains('CUSTOMINDICATORBASEDONRSI')
            .click();

        cy.get('.highcharts-popup-rhs-col')
            .children('.highcharts-popup button')
            .eq(0)
            .click(); // Add indicator.
        cy.chart().should(chart =>
            assert.strictEqual(
                chart.yAxis.length,
                4,
                `After adding a custom indicator that is based on other oscillators,
                another axis should be added.`
            )
        );
    });
});
