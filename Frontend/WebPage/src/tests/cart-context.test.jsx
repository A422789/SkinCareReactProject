import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../lib/cart-context';

function TestCartComponent() {
  const { items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="subtotal">{subtotal}</div>
      <div data-testid="items-list">
        {items.map(i => (
          <div key={i.product._id} data-testid={`item-${i.product._id}`}>
            {i.product.name} - Qty: {i.quantity}
          </div>
        ))}
      </div>
      <button onClick={() => addItem({ _id: 'p1', name: 'Rose Splash', price: 42 }, 1)}>Add Rose</button>
      <button onClick={() => addItem({ _id: 'p2', name: 'Face Mist', price: 32 }, 2)}>Add Face Mist x2</button>
      <button onClick={() => updateQuantity('p1', 5)}>Update Rose Qty</button>
      <button onClick={() => removeItem('p2')}>Remove Face Mist</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

describe('Cart Context Provider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty cart', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
  });

  it('should add products to cart and update quantities & subtotal', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addRoseBtn = screen.getByText('Add Rose');
    const addMistBtn = screen.getByText('Add Face Mist x2');

    // Add first item
    act(() => {
      addRoseBtn.click();
    });
    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.getByTestId('subtotal').textContent).toBe('42');
    expect(screen.getByTestId('item-p1').textContent).toContain('Rose Splash - Qty: 1');

    // Add second item (2 units)
    act(() => {
      addMistBtn.click();
    });
    expect(screen.getByTestId('item-count').textContent).toBe('3');
    expect(screen.getByTestId('subtotal').textContent).toBe('106'); // 42 + 2*32 = 106
  });

  it('should update item quantities', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Rose').click();
    });
    act(() => {
      screen.getByText('Update Rose Qty').click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('5');
    expect(screen.getByTestId('subtotal').textContent).toBe('210'); // 5 * 42 = 210
  });

  it('should remove items from the cart', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Rose').click();
      screen.getByText('Add Face Mist x2').click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('3');

    act(() => {
      screen.getByText('Remove Face Mist').click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('1');
    expect(screen.queryByTestId('item-p2')).toBeNull();
  });

  it('should clear the cart entirely', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Rose').click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('1');

    act(() => {
      screen.getByText('Clear Cart').click();
    });

    expect(screen.getByTestId('item-count').textContent).toBe('0');
  });
});
