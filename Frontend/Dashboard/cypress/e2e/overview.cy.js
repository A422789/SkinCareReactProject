// Helper: Simulate logged-in admin state via localStorage
const loginAsAdmin = () => {
  cy.window().then((win) => {
    win.localStorage.setItem('isAdminLoggedIn', 'true');
    win.localStorage.setItem('adminToken', 'mock-valid-token');
    win.localStorage.setItem('adminTokenTime', Date.now().toString());
    win.localStorage.setItem('adminUser', JSON.stringify({ email: 'admin@test.com', id: '123' }));
  });
};

describe('Dashboard Overview Page E2E', () => {
  beforeEach(() => {
    // Mock all API calls needed by the Overview page
    cy.intercept('GET', '**/api/analytics/overview', {
      statusCode: 200,
      body: {
        totalRevenue: 8500,
        totalOrders: 42,
        totalVisits: 1200,
        salesData: [
          { name: 'Mon', sales: 1200 },
          { name: 'Tue', sales: 2400 },
          { name: 'Wed', sales: 800 },
          { name: 'Thu', sales: 3200 },
          { name: 'Fri', sales: 900 },
        ]
      }
    }).as('getAnalytics');

    cy.intercept('GET', '**/api/orders', {
      statusCode: 200,
      body: [
        { _id: 'o1', status: 'Pending', totalPrice: 120 },
        { _id: 'o2', status: 'Processing', totalPrice: 85 },
        { _id: 'o3', status: 'Delivered', totalPrice: 200 },
      ]
    }).as('getOrders');

    cy.intercept('GET', '**/api/messages', {
      statusCode: 200,
      body: [
        { _id: 'm1', name: 'Sara', message: 'Hello' },
        { _id: 'm2', name: 'Ali', message: 'Test' },
      ]
    }).as('getMessages');

    cy.intercept('GET', '**/api/auth/profile', {
      statusCode: 200,
      body: {
        email: 'admin@test.com',
        _id: '123'
      }
    }).as('profileRequest');

    loginAsAdmin();
    cy.visit('/#/');
  });

  it('should redirect unauthenticated users to login page', () => {
    cy.clearLocalStorage();
    cy.visit('/#/');
    cy.url().should('include', '#/login');
  });

  it('should display overview stats after loading', () => {
    cy.wait(['@getAnalytics', '@getOrders', '@getMessages']);

    // Revenue stat card
    cy.contains('8,500').should('be.visible');

    // Orders count
    cy.contains('42').should('be.visible');

    // Visits
    cy.contains('1,200').should('be.visible');

    // Messages count = 2
    cy.contains('2').should('be.visible');
  });

  it('should display order status summary correctly', () => {
    cy.wait(['@getAnalytics', '@getOrders', '@getMessages']);

    // 1 Pending, 1 Processing, 0 Shipped, 1 Delivered
    cy.contains(/Pending|قيد الانتظار/i).should('be.visible');
    cy.contains(/Processing|جاري المعالجة/i).should('be.visible');
    cy.contains(/Delivered|تم التسليم/i).should('be.visible');
  });

  it('should navigate to orders page via sidebar', () => {
    cy.wait(['@getAnalytics', '@getOrders', '@getMessages']);

    cy.contains(/Orders|الطلبات/i).first().click();
    cy.url().should('include', '#/orders');
  });
});
