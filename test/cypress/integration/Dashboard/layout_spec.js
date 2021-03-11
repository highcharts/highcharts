describe('Components in layout', () => {
    it('is able to visit', () => {
        cy.visit('/Dashboard/chart-interaction/');
    });

    it('should resize properly ', () => {
        cy.get('.highcharts-dashboard-component > .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });

        // Change the viewport
        cy.viewport('ipad-mini');

        // Sizes should be updated to fit the parent
        cy.get('.highcharts-dashboard-component > .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });

        cy.viewport('ipad-2');
    });

    it.skip('Should synchronize visible series', () => {
        // There should be no hidden legend items
        cy.get('.highcharts-legend-item-hidden')
            .should('not.exist');

        // Click first legend item in first chart
        // need to set scrollbehaviour to false to avoid change in dom
        // https://github.com/cypress-io/cypress/issues/9739
        cy.get('.highcharts-legend').first()
            .get('.highcharts-legend-item').first()
            .click({ scrollBehavior: false });

        // Second chart should now have a hidden legend item
        cy.get('.chart-container').last().within(chart => {
            cy.get('.highcharts-legend-item-hidden')
                .should('exist');
        });

    });

    it.skip('Should sync toolip', () => {
        cy.reload();
        cy.get('.chart-container').first()
            .get('.highcharts-point').first()
            .trigger('mouseover');

        // Second chart should now have a tooltip
        cy.get('.chart-container').last().within((chart => {
            cy.get('.highcharts-tooltip-box')
                .should('exist');
        }));
    });
});
