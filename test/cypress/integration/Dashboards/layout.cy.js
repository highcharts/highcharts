describe('Components in layout', () => {
    before(() => {
        cy.visit('/cypress/dashboards/chart-interaction/');
    })

    it('should resize properly ', () => {
        cy.get('.hd-component .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });

        // Change the viewport
        cy.viewport('ipad-mini');

        // Sizes should be updated to fit the parent
        cy.get('.hd-component .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });
    });

});

describe('Chart synchronized series state', () => {
    it('should synchronize visible series between two charts sharing the same store', () => {
        // There should be no hidden legend items
        cy.get('.highcharts-legend-item-hidden')
            .should('not.exist');

        // Click first legend item in first chart
        // need to set scrollbehaviour to false to avoid change in dom
        // https://github.com/cypress-io/cypress/issues/9739
        cy.get('.highcharts-legend').first()
            .get('.highcharts-legend-item').last()
            .click();

        // Second chart should now have a hidden legend item
        cy.get('.chart-container').last().within(chart => {
            cy.get('.highcharts-legend-item-hidden')
                .should('exist');
        });

        // Reset by click
        cy.get('.highcharts-legend').first()
            .get('.highcharts-legend-item').last()
            .click();

        cy.get('.chart-container').last().within(() => {
            cy.get('.highcharts-legend-item-hidden')
                .should('not.exist');
        });

    });

    it('should sync tooltip between two charts sharing the same store', () => {
        cy.get('.chart-container')
            .get('.highcharts-point').first()
            .as('firstPoint')

        cy.get('@firstPoint').trigger('mouseover');

        // Second chart should now have a tooltip
        cy.get('.chart-container').last().within((chart => {
            cy.get('.highcharts-tooltip-box')
                .should('exist')
        }));

        // Move mouse away from the chart area
        cy.get('.chart-container').first().trigger('mouseleave');

        // Second chart should now not have a tooltip
        cy.get('.chart-container').last().within(() => {
            cy.get('.highcharts-tooltip-box')
                .should('not.be.visible') // the container is there, but not visible
        });
    });

});

describe('Chart sync selection and panning', () => {
    before(() => {
        cy.visit('/cypress/dashboards/chart-interaction-selection/')
    });

    it('should sync selection', () => {
        cy.get('.highcharts-container').first().as('firstchart')

        cy.zoom('@firstchart')

        // There should now be two reset-zoom buttons
        cy.get('.highcharts-reset-zoom').should('have.length', 2)


        // Click on reset in the first chart
        cy.get('@firstchart').within(() => {
            cy.get('.highcharts-reset-zoom').click()
        })

        // Now there should be none
        cy.get('.highcharts-reset-zoom').should('have.length', 0)

    })

    // Todo: find a way to assert this
    it('should sync panning', () => {
        cy.get('.highcharts-container').first().as('firstchart')
        cy.zoom('@firstchart')
        // Do the pan
        cy.pan('@firstchart')
    })
});