import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { formatPrice } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const steps = ['Contact', 'Delivery', 'Review'];

export default function CheckoutPage() {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch payment types from API
    fetch(`${import.meta.env.VITE_API_URL}/payment-types`)
      .then(res => res.json())
      .then(data => {
        // filter active ones
        const active = data.filter(p => p.isActive);
        setPaymentTypes(active);
        if (active.length > 0) {
          setSelectedPaymentId(active[0]._id);
        }
      })
      .catch(err => console.error('Error fetching payment types:', err));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateStep(current) {
    const next = {};
    if (current === 0) {
      if (!form.name.trim()) next.name = t('validationName');
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7)
        next.phone = t('validationPhone');
    }
    if (current === 1) {
      if (!form.address.trim()) next.address = t('validationAddress');
      if (!form.city.trim()) next.city = t('validationCity');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  async function handlePlaceOrder() {
    if (isSubmittingOrder) return;
    setIsSubmittingOrder(true);

    const orderPayload = {
      customer: {
        name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        notes: form.notes
      },
      paymentType: selectedPaymentId,
      orderItems: items.map(item => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.product.hasOffer && item.product.offerPrice ? item.product.offerPrice : item.product.price
      })),
      totalPrice: subtotal
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        const orderRes = await response.json();
        setOrderNumber(orderRes.orderId || `HE-${Math.floor(100000 + Math.random() * 900000)}`);
        setConfirmed(true);
        clearCart();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to place order.');
    } finally {
      setIsSubmittingOrder(false);
    }
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
    );
  }

  if (items.length === 0) {
    return (
      <main style={{ margin: '0 auto', display: 'flex', maxWidth: '32rem', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '6rem 1rem', textAlign: 'center' }}>
        <img src={settings?.logoUrl || `${import.meta.env.BASE_URL}images/logo.png`} alt="Store Logo" style={{ height: '6rem', width: 'auto', objectFit: 'contain' }} />
        <p style={{ color: 'var(--muted-foreground)' }}>Your bag is empty — add a ritual before checkout.</p>
        <Link
          to="/shop"
          style={{ borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', textDecoration: 'none' }}
        >
          Shop Now
        </Link>
      </main>
    );
  }

  const selectedPayment = paymentTypes.find(p => p._id === selectedPaymentId);

  return (
    <main style={{ margin: '0 auto', maxWidth: '64rem', padding: '3rem 1rem' }} className="checkout-main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}
      >
        <h1 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--foreground)' }}>{t('checkout')}</h1>
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
                {t(label.toLowerCase())}
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
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{t('contactDetails')}</h2>
                <Field label={t('fullName')} id="name" value={form.name} onChange={(v) => update('name', v)} placeholder="Amira Khalil" error={errors.name} autoComplete="name" />
                <Field label={t('phoneNumber')} id="phone" type="tel" value={form.phone} onChange={(v) => update('phone', v)} placeholder="+1 555 000 1234" error={errors.phone} autoComplete="tel" />
                <button type="button" onClick={handleNext} style={{ marginTop: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                  {t('continueToDelivery')}
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
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{t('deliveryAddress')}</h2>
                <Field label={t('streetAddress')} id="address" value={form.address} onChange={(v) => update('address', v)} placeholder="12 Jasmine Lane, Apt 4" error={errors.address} autoComplete="street-address" />
                <Field label={t('city')} id="city" value={form.city} onChange={(v) => update('city', v)} placeholder="Cairo" error={errors.city} autoComplete="address-level2" />
                <Field label={t('deliveryNotes')} id="notes" value={form.notes} onChange={(v) => update('notes', v)} placeholder={t('deliveryNotesPlaceholder')} />

                {paymentTypes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{t('paymentMethod')}</label>
                    <select
                      value={selectedPaymentId}
                      onChange={(e) => setSelectedPaymentId(e.target.value)}
                      style={{
                        borderRadius: '0.375rem',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        padding: '0.875rem 1rem',
                        fontSize: '0.875rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {paymentTypes.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>

                    {selectedPayment && selectedPayment.instructions && (
                      <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--pearl)', border: '1px dashed var(--gold)', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground)', whiteSpace: 'pre-line' }}>
                        <div style={{ fontWeight: 600, color: 'var(--gold)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CreditCard size={14} /> {t('paymentInstructions')}
                        </div>
                        {selectedPayment.instructions}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setStep(0)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '0.375rem', border: '1px solid var(--border)', padding: '1rem 1.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ChevronLeft size={14} />{t('back')}
                  </button>
                  <button type="button" onClick={handleNext} style={{ flex: 1, borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                    {t('reviewOrder')}
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
                <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{t('reviewYourOrder')}</h2>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(239,230,216,0.6)', padding: '1.25rem', fontSize: '0.875rem', margin: 0 }}>
                  {[
                    { label: t('name'), value: form.name },
                    { label: t('phone'), value: form.phone },
                    { label: t('address'), value: `${form.address}, ${form.city}` },
                    ...(form.notes ? [{ label: t('deliveryNotes'), value: form.notes }] : []),
                    { label: t('payment'), value: selectedPayment ? selectedPayment.name : 'Cash on Delivery' },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                      <dt style={{ color: 'var(--muted-foreground)' }}>{row.label}</dt>
                      <dd style={{ textAlign: 'right', color: 'var(--foreground)', margin: 0 }}>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', borderRadius: '0.375rem', border: '1px solid var(--border)', padding: '1rem 1.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <ChevronLeft size={14} />{t('back')}
                  </button>
                  <motion.button
                    type="button"
                    disabled={isSubmittingOrder}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceOrder}
                    style={{ flex: 1, borderRadius: '0.375rem', backgroundColor: 'var(--gold)', padding: '1rem', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary-foreground)', boxShadow: '0 14px 30px -12px rgba(176,141,87,0.7)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s', opacity: isSubmittingOrder ? 0.7 : 1 }}
                  >
                    {isSubmittingOrder ? t('placingOrder') : t('placeOrder')}
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
          <h2 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>{t('yourOrder')}</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', listStyle: 'none', padding: '0 0 1rem 0', margin: 0 }}>
            {items.map((item) => {
              const productName = item.product.name && typeof item.product.name === 'object'
                ? (item.product.name[language] || item.product.name['en'] || '')
                : item.product.name;
              const productId = item.product.id || item.product._id;
              return (
                <li key={productId} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative', height: '4rem', width: '3rem', flexShrink: 0, overflow: 'hidden', borderRadius: '0.375rem', backgroundColor: 'var(--pearl)' }}>
                    <img
                      src={item.product.image || '/placeholder.svg'}
                      alt={productName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                    <span className="font-serif" style={{ fontSize: '0.875rem', color: 'var(--foreground)' }}>{productName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{t('qty')} {item.quantity}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gold)' }}>
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
              <span>{t('subtotal')}</span><span>{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted-foreground)' }}>
              <span>{t('shipping')}</span><span style={{ color: 'var(--gold)' }}>{t('complimentary')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{t('total')}</span>
            <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--foreground)' }}>{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
      <style>{`
        @media (min-width: 768px) { .checkout-main { padding: 4rem 1.5rem; } }
        @media (min-width: 1024px) { .checkout-grid { grid-template-columns: 1fr 340px; } .checkout-summary { position: sticky; top: 7rem; } }
      `}</style>
    </main>
  );
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
          border: `1.5px solid ${error ? '#ff3333' : 'var(--border)'}`,
          backgroundColor: 'var(--background)',
          padding: '0.875rem 1rem',
          fontSize: '0.875rem',
          color: 'var(--foreground)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => e.target.style.boxShadow = error ? '0 0 0 2px rgba(255,51,51,0.25)' : '0 0 0 2px rgba(176,141,87,0.3)'}
        onBlur={(e) => e.target.style.boxShadow = 'none'}
      />
      {error && (
        <p id={`${id}-error`} style={{ fontSize: '0.75rem', color: '#ff3333', fontWeight: 500, margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}
