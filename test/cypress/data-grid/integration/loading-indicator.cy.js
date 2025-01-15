describe('Loading indicator', () => {
    before(() => {
        cy.visit('/data-grid/cypress/datagrid-custom-class');
    });

    it('Loading indicator should be visible.', () => {
        cy.grid().then((grid) => {
            grid.showLoading('Loading test...');

            cy.get('.highcharts-datagrid-loading-wrapper').should('be.visible');
            cy.get('.highcharts-datagrid-loading-message').should('contain', 'Loading test...');
        });
    });

    it('Loading indicator should be hidden.', () => {
        cy.grid().then((grid) => {
            grid.hideLoading();

            cy.get('.highcharts-datagrid-loading-wrapper').should('not.exist');
        });
    });
});
