function dropComponent(elementName) {
  cy.get(elementName).first().trigger('mouseenter', {force: true});
  cy.get(elementName).first().trigger('mousemove', 'right', {force: true});
  cy.get(elementName).first().trigger('mouseup', 'right', {force: true});
}

describe('Component events', () => {
  before(() => {
    cy.visit('/dashboards/cypress/chart-interaction');
  })

  it('Mount event should be triggered on init', () => {
    cy.get('#mount').should('have.value', 'mount');
  });

  it('Resize event should be triggered after setting init size', () => {
    cy.get('#resize').should('have.value', 'resize');
  });

  // should be uncomment when unmount bug will be fixed
  it.skip('Unmount event should be triggered when removed component', () => {
    cy.toggleEditMode();
    cy.get('.highcharts-dashboards-component').first().click();
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();
    cy.contains('Confirm').click();

    cy.get('#unmount').should('have.value', 'unmount');
  });

  it('Resize event should be triggered after resizing', () => {
    cy.get('#resize').clear();
    cy.toggleEditMode();

    cy.get('.highcharts-dashboards-component').first().click();

    cy.get('.highcharts-dashboards-edit-resize-snap-x').first()
        .trigger('mousedown')
        .trigger('mousemove', { clientX: 300 })
        .trigger('mouseup');

    cy.get('#resize').should('have.value', 'resize');
  });

  it('Update event should be triggered after sidebar update', () => {
    cy.get('.highcharts-dashboards-component').first().click();
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();
    cy.contains('Confirm').click();

    cy.get('#update').should('have.value', 'update');
  });
});
