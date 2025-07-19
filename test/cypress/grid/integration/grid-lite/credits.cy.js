describe('Credits.', () => {
    it('Credits are default and not configurable.', () => {
        cy.visit('/grid-lite/cypress/credits/');
        cy.get('a.hcg-credits')
            .should('have.attr', 'href', 'https://www.highcharts.com')
            .should('exist');

        cy.window().its('Grid').then((grid) => {
            grid.grids[0].update({
                credits: {
                    enabled: false
                }
            });

        cy.grid().then((grid) => {
            grid.update({
            credits: {
                    enabled: false
                }
            });
        });

        cy.get('a.hcg-credits')
            .should('have.attr', 'href', 'https://www.highcharts.com')
            .should('exist');
        });
    });
});
