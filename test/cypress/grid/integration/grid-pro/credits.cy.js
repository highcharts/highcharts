describe('Credits.', () => {
    it('Credits can be configurable.', () => {
        cy.visit('/grid-pro/cypress/credits-pro/');
        cy.get('.highcharts-datagrid-credits')
            .should('contain', 'overwriteText')
            .find('img').should('not.exist'); // Default Highcharts icon

        cy.window().its('Grid').then((grid) => {
            grid.grids[0].update({
                credits: {
                    enabled: false
                }
            });
        });

        cy.get('.highcharts-datagrid-credits').should('not.exist');
    });
});
