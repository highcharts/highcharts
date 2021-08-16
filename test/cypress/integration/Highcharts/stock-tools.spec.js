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
        cy.addIndicator();

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

describe('Popup for the pivot point indicator and the selection box, #15497.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Popup for the Pivot Point indicator should contain a selection box for the algorithm, #15497.', () => {
        cy.openIndicators();

        cy.get('.highcharts-indicator-list')
            .contains('Pivot Points')
            .click();

        cy.contains('label', 'Algorithm')            
            .should('be.visible');

        cy.get('select[name="highcharts-params.algorithm-type-pivotpoints"]')
            .should('be.visible')
            .select('fibonacci');
        cy.addIndicator(); // Add indicator with fibonacci algorythm.
    });

    it('Two indicators with different algorithms should have different points, #15497.', () => {
        cy.openIndicators();

        cy.get('.highcharts-indicator-list')
            .contains('Pivot Points')
            .click();

        cy.addIndicator(); // Add indicator with standard algorythm.

        cy.chart().should(chart =>
            assert.notStrictEqual(
                chart.series[2].points[0].R3,
                chart.series[3].points[0].R3
            )
        );
    });

    it('Changing the algorithm to the same as the second series should result in identical points, #15497.', () => {
        cy.openIndicators();

        cy.get('.highcharts-tab-item')
            .eq(1)
            .click(); // Open EDIT bookmark.

        cy.get('select[name="highcharts-params.algorithm-type-pivotpoints"]')
            .should('have.value', 'fibonacci')
            .select('standard');

        cy.get('.highcharts-popup-rhs-col')
            .children('.highcharts-popup button')
            .eq(1)
            .click();

        cy.chart().should(chart =>
            assert.strictEqual(
                chart.series[2].points[0].R3,
                chart.series[3].points[0].R3
            )
        );
    });

    it('Series and volume in the indicator popup should have a dropdown with series to choose from, #15497. ', () => {
        cy.openIndicators();

        cy.get('.highcharts-indicator-list')
            .contains('Accumulation/Distribution')
            .click();

        cy.get('#highcharts-select-series')
            .select('aapl-ohlc')
            .select('aapl-volume')

        cy.get('#highcharts-select-volume')
            .select('aapl-ohlc')
            .select('aapl-volume')
    });

    it(
        'In the case of indicators where parameters are declared in array, inputs should nott be duplicated. #15497. ',
        () => {
        cy.openIndicators();

        cy.get('.highcharts-indicator-list')
            .eq(34)
            .click(); // Stochastic

        cy.get('input[name="highcharts-stochastic-0"]')
            .should('have.value', '14');
        cy.get('input[name="highcharts-stochastic-1"]')
            .should('have.value', '3');
        cy.get('input[name="highcharts-stochastic-periods"]')
            .should('not.exist');
        cy.addIndicator();

        cy.openIndicators();
        cy.get('.highcharts-indicator-list')
            .contains('Stochastic')
            .click();
        cy.get('input[name="highcharts-stochastic-0"]')
            .eq(0)
            .clear()
            .type('20');
        cy.addIndicator()

        cy.chart().should(chart =>
            assert.notStrictEqual(
                chart.series[3].points[0].x,
                chart.series[4].points[0].x,
                'With diferent periods, indicators should start from diferent place.'
            )
        );
    });
});