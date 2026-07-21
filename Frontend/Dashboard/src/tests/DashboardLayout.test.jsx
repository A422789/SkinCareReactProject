import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

// Mock translation and language context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key) => {
      const trans = {
        adminTitle: 'HE Admin',
        overview: 'Overview',
        products: 'Products',
        orders: 'Orders',
        messages: 'Messages',
        storeProfile: 'Settings',
        logout: 'Logout'
      };
      return trans[key] || key;
    }
  })
}));

// Mock theme context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn()
  })
}));

describe('DashboardLayout Component', () => {
  it('should render the sidebar with navigation links and admin title', () => {
    render(
      <BrowserRouter>
        <DashboardLayout />
      </BrowserRouter>
    );

    // Assert admin title is present
    expect(screen.getByText('HE Admin')).toBeInTheDocument();

    // Assert basic navigation links are rendered
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
