describe('Screen reader sections.', () => {
    before(() => {
        cy.visit('/grid-lite/demo/your-first-grid');
    });

  it('Before-Grid screen reader section should be rendered.', () => {
      cy.get('[id^="grid-screen-reader-region-before-"]')
          .should('exist')
          .and('have.attr', 'role', 'region')
          .and('have.attr', 'aria-label');
  });

  it('Before-Grid section should contain visually hidden content.', () => {
      cy.get('[id^="grid-screen-reader-region-before-"] .hcg-visually-hidden')
          .should('exist');
  });

  it('After-Grid screen reader section should be rendered.', () => {
      cy.get('[id^="grid-screen-reader-region-after-"]')
          .should('exist')
          .and('have.attr', 'role', 'region')
          .and('have.attr', 'aria-label');
  });

  it('After-Grid section should contain visually hidden content.', () => {
      cy.get('[id^="grid-screen-reader-region-after-"] .hcg-visually-hidden')
          .should('exist');
  });

  it('Screen reader sections should be properly destroyed.', () => {
      cy.grid().then((grid) => {
          grid.accessibility.destroy();
          cy.get('[id^="grid-screen-reader-region-before-"]')
              .should('not.exist');
          cy.get('[id^="grid-screen-reader-region-after-"]')
              .should('not.exist');
      });
  });
});
