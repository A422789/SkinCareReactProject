describe('Complete Checkout Flow E2E', () => {
  it('should allow a customer to browse, add to cart, and checkout successfully', () => {
    // 1. Visit Shop Page
    cy.visit('/#/shop');

    // 2. Click on the first product card to view details
    cy.get('.product-card').first().find('a').first().click();

    // 3. We should be on product details page, click Add to Cart
    cy.url().should('include', '#/product/');
    cy.contains(/Add to Cart|أضف إلى السلة/i).click();

    // 4. Click Checkout button in the Cart Drawer to navigate and close the drawer
    cy.contains('a', 'Checkout').click();
    cy.url().should('include', '#/checkout');

    // 5. Fill out step 1 (Contact Details)
    cy.get('#name').type('Test Buyer');
    cy.get('#phone').type('0799999999');
    cy.contains('button', /Continue to Delivery/i).click();

    // 6. Fill out step 2 (Delivery Address)
    cy.get('#address').type('Amman Street 45');
    cy.get('#city').type('Amman');
    
    // Select first payment option if select is available
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').select(1);
      }
    });
    
    cy.contains('button', /Review Order/i).click();

    // Intercept POST request for order creation
    cy.intercept('POST', '**/api/orders').as('placeOrder');

    // 7. Click Place Order button
    cy.contains('button', /Place Order/i).click();

    // 8. Wait for API to resolve and check for success
    cy.wait('@placeOrder').its('response.statusCode').should('eq', 201);
    
    // Should display success message
    cy.contains(/Thank you|Order Confirmed|شكرًا لك/i).should('be.visible');
  });
});
