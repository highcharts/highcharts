describe('Remove the dashboard.', () => {
    before(() => {
        cy.visit('/dashboards/cypress/chart-series-visibility');
    });

    it('Dashboard should be rendered', () => {
        cy.boardRendered()
    });

    it('should synchronize visible series between two charts sharing the same store', () => {
        // There should be no hidden legend items
        cy.get('.highcharts-legend-item-hidden')
            .should('not.exist');

        cy.get('.highcharts-legend').first()
            .get('.highcharts-legend-item').last()
            .as('hiddenItem')
            .click();

        // Hidden legend items in other charts should match
        cy.get('@hiddenItem').invoke('text').then((value) =>{
            cy.get('.chart-container').each((chart)=>{
                cy.wrap(chart).find('.highcharts-legend-item-hidden')
                        .should('exist')
                        .should('have.text', value);
            })
        })
    });
});
