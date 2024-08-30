describe('Edit Mode options', () => {
  before(() => {
      cy.visit('/dashboards/cypress/edit-mode-disabled-markup');
      cy.viewport(1200, 1000);
  });

  it('Disabled EditMode markup should not be printed', () => {
    cy.get('.highcharts-dashboards--fullscreen').should('not.exist');
    cy.get('.highcharts-dashboards-edit-tools').should('not.exist');
    cy.get('.highcharts-dashboards-edit-ctx-detection-pointer').should('not.exist');
    cy.get('.highcharts-dashboards-edit-confirmation-popup').should('not.exist');
    cy.get('.highcharts-dashboards-edit-overlay').should('not.exist');
  });
});
