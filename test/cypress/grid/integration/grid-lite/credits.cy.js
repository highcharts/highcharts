describe('Credits.', () => {
    it('Credits are default and not configurable.', () => {
        cy.visit('/grid-lite/cypress/credits/');
        cy.get('.hcg-credits')
            .should('not.contain', 'overwriteText')
            .find('img').should('exist'); // Default Highcharts icon

        cy.window().its('Grid').then((grid) => {
            grid.grids[0].update({
                credits: {
                    enabled: false
                }
            });

            cy.get('.hcg-credits')
                .find('img').should('exist'); // Default Highcharts icon
        });
    });
});
