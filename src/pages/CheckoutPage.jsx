import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft } from 'lucide-react'
import { useCart } from '../lib/cart-context'
import { formatPrice } from '../lib/products'

const steps = ['Contact', 'Delivery', 'Review']

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validateStep(current) {
    const next = {}
    if (current === 0) {
      if (!form.name.trim()) next.name = 'Please enter your full name.'
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7)
        next.phone = 'Please enter a valid phone number.'
    }
    if (current === 1) {
      if (!form.address.trim()) next.address = 'Please enter your street address.'
      if (!form.city.trim()) next.city = 'Please enter your city.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1)
  }

  function handlePlaceOrder() {
    setOrderNumber(`HE-${Math.floor(100000 + Math.random() * 900000)}`)
    setConfirmed(true)
    clearCart()
  }

  if (confirmed) {
    return (
      <main style={{ margin: '0 auto', display: 'flex', maxWidth: '32rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '5rem 1rem', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
          style={{ display: 'flex', height: '5rem', width: '5rem', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', backgroundColor: 'var(--gold)', boxShadow: '0 20px 40px -14px rgba(176,141,87,0.8)' }}
        >
          <Check size={36} style={{ color: 'var(--primary-foreground)' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
        >
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)' }}>Order Confirmed</span>
          <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>
            Thank you, {form.name.split(' ')[0]}.
          </h1>
          <p style={{ lineHeight: 1.7, color: 'var(--muted-foreground)' }}>
            Your order <span style={{ fontWeight: 500, color: 'var(--gold)' }}>{orderNumber}</span> has been
            received. We&apos;ll call {form.phone} to confirm delivery to {form.city}. Your ritual
            is on its way.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link
            to="/shop"
            style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none' }}
          >
            Continue Shopping
          </Link>
        </motion.div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main style={{ margin: '0 auto', display: 'flex', maxWidth: '32rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '6rem 1rem', textAlign: 'center' }}>
        <img src="/images/logo.png" alt="HE Logo" style={{ height: '6rem', width: 'auto', objectFit: 'contain' }} />
        <p style={{ color: 'var(--muted-foreground)' }}>Your bag is empty — add a ritual before checkout.</p>
        <Link
          to="/shop"
          style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none' }}
        >
          Shop Now
        </Link>
      </main>
    )
  }

  return (
    <main style={{ margin: '0 auto', maxWidth: '64rem', padding: '3rem 1rem' }} className="checkout-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}
      >
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>Checkout</h1>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }} aria-label="Checkout progress">
          {steps.map((label, i) => (
            <li key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  display: 'flex',
                  height: '2rem',
                  width: '2rem',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  transition: 'all 0.2s',
                  backgroundColor: i < step ? 'var(--gold)' : 'transparent',
                  border: i < step ? 'none' : i === step ? '2px solid var(--gold)' : '1px solid var(--border)',
                  color: i < step ? 'var(--primary-foreground)' : i === step ? 'var(--gold)' : 'var(--muted-foreground)',
                }}
                aria-current={i === step ? 'step' : undefined}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: i <= step ? 'var(--foreground)' : 'var(--muted-foreground)',
                }}
              >
                {label}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" style={{ height: '1px', width: '2rem', backgroundColor: 'var(--border)' }} />
              )}
            </li>
          ))}
        </ol>
      </motion.div>

      <div style={{ display: 'grid', alignItems: 'start', gap: '2.5rem' }} className="checkout-grid">
        <div style={{ borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem 2rem' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>Contact Details</h2>
                <Field label="Full Name" id="name" value={form.name} onChange={(v) => update('name', v)} placeholder="Amira Khalil" error={errors.name} autoComplete="name" />
                <Field label="Phone Number" id="phone" type="tel" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+1 555 000 1234" error={errors.phone} autoComplete="tel" />
                <button type="button" onClick={handleNext} style={{ marginTop: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                  Continue to Delivery
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>Delivery Address</h2>
                <Field label="Street Address" id="address" value={form.address} onChange={(v) => update('address', v)} placeholder="12 Jasmine Lane, Apt 4" error={errors.address} autoComplete="street-address" />
                <Field label="City" id="city" value={form.city} onChange={(v) => update('city', v)} placeholder="New York" error={errors.city} autoComplete="address-level2" />
                <Field label="Delivery Notes (Optional)" id="notes" value={form.notes} onChange={(v) => update('notes', v)} placeholder="Leave at the front desk" />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '0.375rem', border: '1px solid var(--border)', padding: '1rem 1.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ChevronLeft size={14} />Back
                  </button>
                  <button type="button" onClick={handleNext} style={{ flex: 1, borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>Review Your Order</h2>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239,230,216,0.6)', padding: '1.25rem', fontSize: '0.875rem', margin: 0 }}>
                  {[
                    { label: 'Name', value: form.name },
                    { label: 'Phone', value: form.phone },
                    { label: 'Address', value: `${form.address}, ${form.city}` },
                    ...(form.notes ? [{ label: 'Notes', value: form.notes }] : []),
                    { label: 'Payment', value: 'Cash on Delivery' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <dt style={{ color: 'var(--muted-foreground)' }}>{row.label}</dt>
                      <dd style={{ textAlign: 'right', color: 'var(--foreground)', margin: 0 }}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '0.375rem', border: '1px solid var(--border)', padding: '1rem 1.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ChevronLeft size={14} />Back
                  </button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    style={{ flex: 1, borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', boxShadow: '0 14px 30px -12px rgba(176,141,87,0.7)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  >
                    Place Order
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem' }}
          aria-label="Order summary"
          className="checkout-summary"
        >
          <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>Your Order</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', listStyle: 'none', padding: '0 0 1rem 0', margin: 0 }}>
            {items.map((item) => (
              <li key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', height: '4rem', width: '3rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.375rem', backgroundColor: 'var(--pearl)' }}>
                  <img
                    src={item.product.image || '/placeholder.svg'}
                    alt={item.product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                  <span className="font-serif" style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{item.product.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Qty {item.quantity}</span>
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--gold)' }}>
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
              <span>Shipping</span><span style={{ color: 'var(--gold)' }}>Complimentary</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Total</span>
            <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
      <style>{`
        @media (min-width: 768px) { .checkout-main { padding: 4rem 1.5rem; } }
        @media (min-width: 1024px) { .checkout-grid { grid-template-columns: 1fr 340px; } .checkout-summary { position: sticky; top: 7rem; } }
      `}</style>
    </main>
  )
}

function Field({ label, id, value, onChange, placeholder, error, type = 'text', autoComplete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        style={{
          borderRadius: '0.375rem',
          border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
          backgroundColor: 'var(--background)',
          padding: '0.875rem 1rem',
          fontSize: '0.875rem',
          color: 'var(--foreground)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(176,141,87,0.3)'}
        onBlur={(e) => e.target.style.boxShadow = 'none'}
      />
      {error && (
        <p id={`${id}-error`} style={{ fontSize: '0.75rem', color: 'var(--destructive)', margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  )
}
