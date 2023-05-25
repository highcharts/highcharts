describe('Axis height recalculation.', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/highcharts/cypress/stock-tools-gui/');
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
            const yAxis = chart.yAxis.filter(a => !a.options.isInternal);

            for(let i = 3; i < yAxis.length - 1; i++) {
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

        cy.chart().should(chart => {
            // Exclude 2 first axes and navigator axis.
            const yAxis = chart.yAxis.filter(a => !a.options.isInternal);

            for(let i = 3; i < yAxis.length - 1; i++) {
                assert.closeTo(
                    yAxis[i].top + yAxis[i].height,
                    yAxis[i + 1].top,
                    1,
                    `The end of the ${i + 1} axis should be close to beginning of the ${i + 2} axis.`
                )
            }
        });

        cy.chart().should(chart => {
            const yAxis = chart.yAxis[0];
            yAxis.update({
                top: yAxis.top + 30,
                height: yAxis.height - 30
            });
        });
        cy.openIndicators()
        cy.get('.highcharts-tab-item')
            .eq(1)
            .click(); // Open EDIT bookmark.
        cy.get('.highcharts-indicator-list')
            .contains('ATR (30)')
            .click();
        cy.get('.highcharts-popup-rhs-col')
            .children('.highcharts-popup button')
            .eq(2)
            .click(); // Remove that indicator.
        cy.chart().should(chart => {
            // Exclude 2 first axes and navigator axis.
            const yAxis = chart.yAxis.filter(a => !a.options.isInternal);

            for(let i = 3; i < yAxis.length - 1; i++) {
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