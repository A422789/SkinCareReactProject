import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Overview from '../pages/Overview';

// Mock translation and language context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key) => {
      const trans = {
        overview: 'Overview',
        totalSales: 'Total Sales',
        activeOrders: 'Active Orders',
        customerMessages: 'Customer Messages'
      };
      return trans[key] || key;
    }
  })
}));

// Mock theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark'
  })
}));

// Mock global fetch for APIs
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Overview Dashboard Page', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.setItem('adminToken', 'mock-token');
  });

  it('should show loader then display analytics metrics on success', async () => {
    // Mock successful API responses
    mockFetch.mockImplementation((url) => {
      if (url.includes('/analytics/overview')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            totalRevenue: 15400,
            totalOrders: 145,
            totalVisits: 3200,
            salesData: []
          })
        });
      }
      // Return empty array for orders/messages
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <BrowserRouter>
        <Overview />
      </BrowserRouter>
    );

    // 1. Should show loading state first
    expect(screen.getByText(/Loading overview dashboard/i)).toBeInTheDocument();

    // 2. Wait for loading to finish and verify statistics
    await waitFor(() => {
      expect(screen.queryByText(/Loading overview dashboard/i)).not.toBeInTheDocument();
    });

    // Check statistics values render correctly
    expect(screen.getByText('15,400 EGP')).toBeInTheDocument(); // Sales
    expect(screen.getByText('145')).toBeInTheDocument();       // Orders
    expect(screen.getByText('3,200')).toBeInTheDocument();     // Visits
  });
});
