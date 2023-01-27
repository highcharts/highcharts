describe('Component loading', () => {
  before(() => {
    cy.visit('/cypress/dashboards/component-loading/', {
    });
  })


  it('image should be within parent cell', () => {
    cy.get('#dashboard-col-3').within(([dashboardCell]) => {
      const cellBox = dashboardCell.getBoundingClientRect();
      const image = dashboardCell.querySelector('img');
      const imageBox = image?.getBoundingClientRect();

      if (!cellBox || !imageBox) {
        throw new Error('Failed to find the cell and/or image');
      }

      for (const dimension of Object.keys(cellBox.toJSON())) {
        assert(cellBox[dimension] >= imageBox[dimension], 'Out of bounds: ' + dimension);
      }
    });

  });

});
