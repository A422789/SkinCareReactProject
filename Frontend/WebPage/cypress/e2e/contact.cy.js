describe('Customer Message Submission E2E', () => {
  beforeEach(() => {
    // Visit contact page
    cy.visit('/#/contact');
  });

  it('should fill out the contact form and submit successfully', () => {
    // Check if form is visible
    cy.get('form').should('be.visible');

    // Fill form fields
    cy.get('input[name="name"]').type('Ahmad Test Customer');
    cy.get('input[name="email"]').type('ahmad.test@gmail.com');
    cy.get('input[name="phone"]').type('0791234567');
    cy.get('input[name="subject"]').type('Test Inscription');
    cy.get('textarea[name="message"]').type('Hello, this is an automated message test from Cypress.');

    // Intercept POST request for messages to verify network API call
    cy.intercept('POST', '**/api/messages').as('submitMessage');

    // Submit form
    cy.get('button[type="submit"]').click();

    // 6. Wait for the API call and assert response status
    cy.wait('@submitMessage').its('response.statusCode').should('eq', 201);

    // 7. Verify success message appears
    cy.contains(/successfully|بنجاح/i).should('be.visible');
  });
});
