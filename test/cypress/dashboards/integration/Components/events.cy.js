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

  it('Resize event should be triggered after resizing', () => {
    cy.get('#resize').clear();
    cy.toggleEditMode();

    cy.get('.highcharts-dashboards-component').first().click();

    cy.get('.highcharts-dashboards-edit-resize-snap-x').first()
        .trigger('mousedown', { force: true })
        .trigger('mousemove', { clientX: 300, force: true })
        .trigger('mouseup', {force: true});

    cy.get('#resize').should('have.value', 'resize');
  });

  it('Update event should be triggered after sidebar update', () => {
    cy.get('.highcharts-dashboards-component').first().click({force: true});
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();
    cy.get('.highcharts-dashboards-edit-accordion-header-btn').eq(3).click();
    cy.get('.highcharts-dashboards-edit-toggle-wrapper').eq(1).click();

    cy.get('#update').should('have.value', 'update');
    cy.contains('Confirm').click();
  });

  it('Press ESC should close sidebar popup', () => {
    cy.get('.highcharts-dashboards-component').first().click({ force: true });
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(2)').click();

    cy.contains('Confirm').should('be.visible');
    cy.get('body').type('{esc}', { force: true });

    cy.contains('Confirm').should('not.be.visible');
  });

  it('Press ESC should close confirmation popup', () => {
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(3)').click();

    cy.contains('Confirm').should('be.visible');
    cy.get('body').type('{esc}', { force: true });

    cy.contains('Confirm').should('not.be.visible');
  });

  it('Unmount event should be triggered when removed component', () => {
    cy.get('.highcharts-dashboards-edit-toolbar-cell > .highcharts-dashboards-edit-toolbar-item:nth-child(3)').click({force: true});
    cy.contains('Confirm').click({force: true});

    cy.get('#unmount').should('have.value', 'unmount');
  });

  it('Disabling edit mode should be possible after removing component', () => {
    cy.toggleEditMode();
    cy.get('.highcharts-dashboards-edit-toggle-container')
      .should('have.attr', 'aria-checked', 'false');
  });
});
