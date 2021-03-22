describe('Components in layout', () => {
    it('is able to visit', () => {
        cy.visit('/dashboard/chart-interaction/');
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
    });

});

describe('Chart synchronized events', () => {

    // reset before each of these
    beforeEach(() => {
        cy.reload()
        cy.wait(250)
    })

    it('Should synchronize visible series between two charts sharing the same store', () => {
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

    it('Should sync tooltip between two charts sharing the same store', () => {
        cy.get('.chart-container')
            .get('.highcharts-point').first()
            .as('firstPoint')

        cy.get('@firstPoint').trigger('mouseover', { scrollBehavior: false });

        // Second chart should now have a tooltip
        cy.get('.chart-container').last().within((chart => {
            cy.get('.highcharts-tooltip-box')
                .should('exist')
        }));

        // Move mouse away from the chart area
        cy.get('.chart-container').first().trigger('mouseleave', { scrollBehavior: false });

        // Second chart should now not have a tooltip
        cy.get('.chart-container').last().within((chart => {
            cy.get('.highcharts-tooltip-box')
                .should('not.be.visible') // the container is there, but not visible
        }));
    });

    it('Should sync selection', () => {
        cy.visit('/dashboard/chart-interaction-selection/')
        cy.wait(1000)
        cy.get('.highcharts-container').first().as('firstchart')

        cy.get('@firstchart').trigger('mousedown', 50)
            .trigger('mousemove', { x: 50, y: 50 })
            .trigger('mouseup')

        // There should now be two reset-zoom buttons
        cy.get('.highcharts-reset-zoom').should('have.length', 2)

        // Click on reset in the first chart
        cy.get('@firstchart').within(()=>{
            cy.get('.highcharts-reset-zoom').click()
        })

        // Now there should be none
        cy.get('.highcharts-reset-zoom').should('have.length', 0)

    })

});
