describe('Disable the column headers.', () => {
    before(() => {
        cy.visit('/data-grid/options/disable-column-headers');
    });

    it('The column headers should be disabled.', () => {
        cy.get('.highcharts-datagrid-header-container').should('not.exist');
        cy.get('.highcharts-datagrid-cell').should('exist');
    });
});
