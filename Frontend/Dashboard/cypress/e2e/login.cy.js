describe('Admin Login Flow E2E', () => {
  beforeEach(() => {
    // Clear any existing auth state before each test
    cy.clearLocalStorage();
    cy.visit('/#/login');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();

    // Both required field errors should appear
    cy.contains(/Email is required|البريد الإلكتروني مطلوب/i).should('be.visible');
    cy.contains(/Password is required|كلمة المرور مطلوبة/i).should('be.visible');
  });

  it('should show validation error for invalid email format', () => {
    cy.get('input[type="email"]').type('invalid@email');
    cy.get('input[type="password"]').type('somepassword');
    cy.get('button[type="submit"]').click();

    cy.contains(/valid email|بريد إلكتروني صالح/i).should('be.visible');
  });

  it('should show error message on wrong credentials', () => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('wrong@email.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

    // Error message should be displayed
    cy.get('form').contains(/invalid|خطأ|incorrect/i).should('be.visible');
  });

  it('should login successfully with correct credentials and redirect to dashboard', () => {
    const adminEmail = Cypress.env('ADMIN_EMAIL') || 'admin@test.com';
    const adminPass = Cypress.env('ADMIN_PASSWORD') || 'admin123';

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'mock-valid-token',
        email: adminEmail,
        _id: '123'
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/auth/profile', {
      statusCode: 200,
      body: {
        email: adminEmail,
        _id: '123'
      }
    }).as('profileRequest');

    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPass);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Should redirect to main dashboard after successful login
    cy.url().should('eq', Cypress.config('baseUrl') + '/#/');

    // Token should be stored in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('adminToken')).to.not.be.null;
      expect(win.localStorage.getItem('isAdminLoggedIn')).to.eq('true');
    });
  });
});
