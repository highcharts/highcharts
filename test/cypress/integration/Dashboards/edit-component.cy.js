describe('Udate component class via UI', () => {
    beforeEach(() => {
        cy.visit('/cypress/dashboards/dashboard-layout');
        cy.viewport(1200, 1000);
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-toggle-slider').click();
    });

    it('should be able to open edit mode', function() {

        const newChartID= 'myNewChart';

        cy.get('.hd-component').first().click();
        cy.get('.hd-edit-toolbar-cell > .hd-edit-toolbar-item:nth-child(2)').click();
        cy.get('#chartID').as('chartIDfield')

        cy.get('@chartIDfield').invoke('val').then(exisitingVal =>{

            cy.get('@chartIDfield').clear().type(newChartID);
            cy.get(':nth-child(2) > .hd-edit-tabs-buttons-wrapper > :nth-child(1)').click()
            cy.get('#' + newChartID);

            // TODO when handler is updated
            // cy.get('#' + exisitingVal).should('not.exist')
        });
    });

});
