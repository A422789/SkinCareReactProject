import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

// 1. Mock translation and language context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key) => {
      const trans = {
        addToCart: 'Add to Cart',
        new: 'New',
        sale: 'Sale'
      };
      return trans[key] || key;
    }
  })
}));

// 2. Mock settings context
vi.mock('../context/SettingsContext', () => ({
  useSettings: () => ({
    categories: []
  })
}));

// 3. Mock cart context
const mockAddItem = vi.fn();
vi.mock('../lib/cart-context', () => ({
  useCart: () => ({
    addItem: mockAddItem
  })
}));

const mockProduct = {
  _id: 'p1',
  slug: 'rose-splash',
  name: { en: 'Rose Splash', ar: 'بخاخ الورد' },
  category: 'splash-cat',
  price: 42,
  image: '/rose.png',
  isNew: true
};

describe('ProductCard Component', () => {
  it('should render product name, price and image correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    // Assert name is localized/rendered
    expect(screen.getByText('Rose Splash')).toBeInTheDocument();
    
    // Assert price is formatted
    expect(screen.getByText('42.00 EGP')).toBeInTheDocument();

    // Assert image source and alt
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/rose.png');
    expect(img.getAttribute('alt')).toBe('Rose Splash');
  });

  it('should trigger addItem when Add to Cart button is clicked', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const btn = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(btn);

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });
});
