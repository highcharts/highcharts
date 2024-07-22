describe('DataGrid events.', () => {
    before(() => {
        cy.visit('data-grid/cypress/column-cell-events');
    });

    it('Cell mouseOver / mouseOut event.', () => {
        cy.get('.highcharts-datagrid-row[data-row-index="1"] > td[data-column-id="product"]')
            .trigger('mouseover');
        cy.get('#cellMouseOver').should('have.value', 'cellMouseOver');

        cy.get('.highcharts-datagrid-row[data-row-index="1"] > td[data-column-id="product"]')
            .click()
            .trigger('mouseout');
        cy.get('#cellMouseOut').should('have.value', 'cellMouseOut');
    });

    it('Cell click event', () => {
        cy.get('.highcharts-datagrid-row[data-row-index="1"] > td[data-column-id="product"]').click({force: true});
        cy.get('#cellClick').should('have.value', 'cellClick');
    });

    it('Cell afterEdit event', () => {
        cy.get('.highcharts-datagrid-row[data-row-index="1"] > td[data-column-id="product"]')
            .click({force: true})
            .clear()
            .type('Strawberries');
        cy.get('#cellAfterEdit').should('have.value', 'cellAfterEdit');
    });

    it('After sorting event.', () => {
        cy.get('th[data-column-id="product"]').click();
        cy.get('#columnSorting').should('have.value', 'afterSorting');
    });
});
