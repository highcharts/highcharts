const titleClassError = 'highcharts-dashboards-component-title-error';

describe('Component error handling', () => {
  before(() => {
    cy.visit('/dashboards/components/component-error-handler', {});
  })

  it('Component that type does not exist, should throw error', () => {
    cy.get('#dashboard-col-0 h1').should('have.class', titleClassError);
  });

  it('HTML Component that has no tagName param, should throw error', () => {
    cy.get('#dashboard-col-1 h1').should('have.class', titleClassError);
  });

  it('Highcharts Component that has wrong configuration, should throw error', () => {
    cy.get('#dashboard-col-2 h1').should('have.class', titleClassError);
  });
});
