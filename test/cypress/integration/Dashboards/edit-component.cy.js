
describe('Add component through UI', () => {
    beforeEach(() => {
        cy.visit('/cypress/dashboards/dashboard-layout');
        cy.viewport(1200, 1000);
        cy.get('.hd-edit-context-menu-btn').click();
        cy.get('.hd-edit-toggle-slider').click();
    });

    it('should be able to open edit mode', function() {

      const newChartClassName = 'myNewChartClassName';

      cy.get('.hd-component').first().click();
      // TODO: should have a better classname for each button
      cy.get('[style="left: 584px; top: 53px;"] > .hd-edit-menu > :nth-child(2) > div').click();

      cy.get('#chartClassName').clear().type(newChartClassName);

      // TODO: apply and discard buttons should have classnames and probably aria-roles
      cy.get(':nth-child(2) > .hd-edit-tabs-buttons-wrapper > :nth-child(1)').click()

      // If the new className exists, success!?!
      // TODO: maybe check if the old one is removed
      cy.get('.' + newChartClassName);
    });

});
