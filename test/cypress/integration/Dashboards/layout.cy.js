describe('Components in layout', () => {
    before(() => {
        cy.visit('/dashboards/cypress/chart-interaction/');
    })

    it('should resize properly ', () => {
        cy.get('.highcharts-dashboards-component .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });

        // Change the viewport
        cy.viewport('ipad-mini');

        // Sizes should be updated to fit the parent
        cy.get('.highcharts-dashboards-component .chart-container').each((element, i) => {
            assert.strictEqual(element.width(), element.parent().width());
        });
    });

    it('components should reflow when width of board is changing ', () => {
        cy.board().then((board) => {
            const componentContainer = board.mountedComponents[0].cell.container,
                componentInitWidth = componentContainer.offsetWidth;
    
            board.container.style.width = '500px';

            assert.ok(
                componentContainer.offsetWidth < componentInitWidth,
                'The width of cell is smaller than on init.'
              );
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

    it('should sync tooltip between two charts sharing the same connector', () => {
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
        cy.get('.chart-container').first().trigger('mousemove', {
            pageX: 500,
            pageY: 500
        });

        // Second chart should now not have a tooltip
        cy.get('.chart-container').last().within(() => {
            cy.get('.highcharts-tooltip-box')
                .should('not.be.visible') // the container is there, but not visible
        });
    });

});
