describe('Editable component options', () => {
    beforeEach(() => {
        cy.visit('/cypress/dashboards/dashboard-layout');
        cy.viewport(1200, 1000);
        cy.toggleEditMode();
    });

    it('should be able update chart ID via edit mode GUI', function() {

        const newChartID= 'myNewChart';

        cy.get('.highcharts-dashboards-component').first().click();
        cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();
        cy.get('button.highcharts-dashboards-outer-accordeon-header-btn').contains('Chart id').click();
        cy.get('#chartID').as('chartIDfield')

        cy.get('@chartIDfield').invoke('val').then(exisitingVal =>{

            cy.get('@chartIDfield').clear().type(newChartID);
            cy.contains('Apply').click()
            cy.get('#' + newChartID);

            // TODO when handler is updated
            // cy.get('#' + exisitingVal).should('not.exist')
        });
    });

});
