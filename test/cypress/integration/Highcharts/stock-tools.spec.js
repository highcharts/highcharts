describe('Stock Tools annotation popup, #15725', () => {
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

describe('Indicator popup searchbox, #16019.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Search indicator input should filter and sort the list, #16019.', () => {
        cy.openIndicators();

        // Test if searching works.
        cy.get('input[name="highcharts-input-search-indicators"]')
            .click()
            .type('ac');
        cy.get('.highcharts-indicator-list').should(($p) => {
            expect($p).to.have.length(5)
        })

        // Test the sorting.
        cy.get('input[name="highcharts-input-search-indicators"]')
            .type('c');
        cy.get('.highcharts-indicator-list li:first')
            .should('contain.text', 'Acceleration Bands');

        // Test if regex works.
        cy.get('input[name="highcharts-input-search-indicators"]')
            .clear();
        cy.get('input[name="highcharts-input-search-indicators"]')
            .type('cd');
        cy.get('.highcharts-indicator-list li:first')
            .should('contain.text', 'MACD');
    });

    it('Clicking the reset button should reset the indicator list, #16019.', () => {
        cy.get('.clear-filter-button')
        .click();

        cy.get('input[name="highcharts-input-search-indicators"]')
            .should('have.value', '')

        cy.get('.highcharts-indicator-list')
            .should('have.length', 50)
    });
});