import React, { useState } from 'react';
import { productsData, categoriesData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, FolderOpen, CheckCircle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const LanguageToggle = ({ lang, setLang }) => (
  <div className="flex rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
    <button
      type="button"
      onClick={() => setLang('en')}
      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
      style={lang === 'en' ? { backgroundColor: 'var(--surface)', color: 'var(--gold)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--foreground-muted)' }}
    >
      EN
    </button>
    <button
      type="button"
      onClick={() => setLang('ar')}
      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${lang === 'ar' ? 'bg-white shadow-sm' : 'text-gold'}`}
      style={lang === 'ar' ? { backgroundColor: 'var(--surface)', color: 'var(--gold)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: 'var(--foreground-muted)' }}
    >
      العربية
    </button>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState(productsData);
  const [formLang, setFormLang] = useState('en');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const [categories, setCategories] = useState(categoriesData);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '', tagline: '', price: '', stock: '', category: categoriesData[0] || '', description: '',
    ingredients: '', howToUse: '',
    isNewArrival: false, isBestSeller: false, hasOffer: false, offerPrice: '', image: ''
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setImagePreview(product.image || '');
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', tagline: '', price: '', stock: '', category: categories[0] || '', description: '',
        ingredients: '', howToUse: '',
        isNewArrival: false, isBestSeller: false, hasOffer: false, offerPrice: '', image: ''
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setDragOver(false); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { ...formData, image: imagePreview || formData.image };
    
    // Check if product with same name already exists
    const duplicateIndex = products.findIndex(p => p.name.toLowerCase() === formData.name.toLowerCase() && p.id !== editingProduct?.id);
    
    if (duplicateIndex !== -1 && !editingProduct) {
      // Duplicate exists and we are adding a new product -> increase quantity by 1
      const updatedProducts = [...products];
      updatedProducts[duplicateIndex].stock = Number(updatedProducts[duplicateIndex].stock) + 1;
      setProducts(updatedProducts);
      showToast(`"${formData.name}" already exists! Stock has been increased by 1.`);
    } else if (editingProduct) {
      // Editing product
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: p.id } : p));
      showToast(`Product "${formData.name}" updated successfully.`);
    } else {
      // Adding new product
      setProducts([...products, { ...productData, id: Date.now() }]);
      showToast(`Product "${formData.name}" added successfully.`);
    }
    handleCloseModal();
  };

  // Category management handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.some(c => c.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      alert('Category already exists!');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleEditCategory = (idx) => {
    setEditingCategoryIdx(idx);
    setEditingCategoryName(categories[idx]);
  };

  const handleSaveCategory = (idx) => {
    if (!editingCategoryName.trim()) return;
    const updated = [...categories];
    updated[idx] = editingCategoryName.trim();
    setCategories(updated);
    setEditingCategoryIdx(null);
  };

  const handleDeleteCategory = (idx) => {
    if (window.confirm(`Are you sure you want to delete category "${categories[idx]}"?`)) {
      setCategories(categories.filter((_, i) => i !== idx));
    }
  };

  const handleImageChange = (val) => {
    setImagePreview(val);
    setFormData(prev => ({ ...prev, image: val }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };





  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--foreground)',
  };

  const inputFocusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(176,141,87,0.15)'; },
    onBlur: (e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Products Management</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: 'var(--pearl)',
              color: 'var(--gold)',
              border: '1px solid var(--border)'
            }}
          >
            <FolderOpen className="w-5 h-5" />
            Categories
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: '#fdfaf4',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <Search className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full sm:max-w-xs outline-none text-sm bg-transparent"
            style={{ color: 'var(--foreground)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Product</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Category</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Price</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Stock</th>
                <th className="p-4 font-medium text-sm" style={{ color: 'var(--foreground-secondary)' }}>Attributes</th>
                <th className="p-4 font-medium text-sm text-right" style={{ color: 'var(--foreground-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={product.id} 
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" style={{ backgroundColor: 'var(--pearl)', border: '1px solid var(--border-light)' }} />
                    <div>
                      <span className="font-medium block" style={{ color: 'var(--foreground)' }}>{product.name}</span>
                      {product.description && (
                        <span className="text-xs truncate block max-w-[200px]" style={{ color: 'var(--foreground-muted)' }}>{product.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm" style={{ color: 'var(--foreground-secondary)' }}>{product.category}</td>
                  <td className="p-4 font-medium text-sm" style={{ color: 'var(--foreground)' }}>
                    {product.hasOffer ? (
                      <div>
                        <span style={{ textDecoration: 'line-through', color: 'var(--foreground-muted)' }}>${product.price}</span>
                        <span className="ml-2" style={{ color: 'var(--success)' }}>${product.offerPrice}</span>
                      </div>
                    ) : `$${product.price}`}
                  </td>
                  <td className="p-4 text-sm" style={{ color: product.stock < 50 ? 'var(--destructive)' : 'var(--foreground-secondary)', fontWeight: product.stock < 50 ? 700 : 400 }}>
                    {product.stock}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {product.isNewArrival && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-new-bg)', color: 'var(--badge-new-text)' }}>New</span>}
                      {product.isBestSeller && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-best-bg)', color: 'var(--badge-best-text)' }}>Best Seller</span>}
                      {product.hasOffer && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-offer-bg)', color: 'var(--badge-offer-text)' }}>Offer</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)} 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.backgroundColor = 'var(--warning-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--foreground-muted)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--destructive)'; e.currentTarget.style.backgroundColor = 'var(--destructive-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--foreground-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center" style={{ color: 'var(--foreground-muted)' }}>No products found.</div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={handleCloseModal} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between sticky top-0 z-20" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <LanguageToggle lang={formLang} setLang={setFormLang} />
                </div>
                <button onClick={handleCloseModal} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={formLang === 'ar' ? 'rtl' : 'ltr'}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {formLang === 'ar' ? 'اسم المنتج *' : 'Product Name *'}
                    </label>
                    <input 
                      required 
                      type="text" 
                      value={formLang === 'ar' ? (formData.nameAr || '') : formData.name} 
                      onChange={(e) => setFormData({...formData, [formLang === 'ar' ? 'nameAr' : 'name']: e.target.value})} 
                      className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {formLang === 'ar' ? 'الشعار الفرعي (عبارة قصيرة)' : 'Tagline'}
                    </label>
                    <input 
                      type="text" 
                      value={formLang === 'ar' ? (formData.taglineAr || '') : (formData.tagline || '')} 
                      onChange={(e) => setFormData({...formData, [formLang === 'ar' ? 'taglineAr' : 'tagline']: e.target.value})} 
                      className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers}
                      placeholder={formLang === 'ar' ? 'مثال: ترطيب · نضارة · تجديد' : 'e.g. Calm · Restore · Glow'} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {formLang === 'ar' ? 'الفئة *' : 'Category *'}
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm cursor-pointer"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {categories.length === 0 && (
                        <option value="">No categories available</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {formLang === 'ar' ? 'السعر ($) *' : 'Price ($) *'}
                    </label>
                    <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} 
                      className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {formLang === 'ar' ? 'الكمية بالمخزن *' : 'Stock *'}
                    </label>
                    <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                      className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {formLang === 'ar' ? 'الوصف' : 'Description'}
                  </label>
                  <textarea 
                    rows="3" 
                    value={formLang === 'ar' ? (formData.descriptionAr || '') : (formData.description || '')} 
                    onChange={(e) => setFormData({...formData, [formLang === 'ar' ? 'descriptionAr' : 'description']: e.target.value})} 
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" 
                    style={inputStyle} {...inputFocusHandlers}
                    placeholder={formLang === 'ar' ? 'اكتب وصفاً للمنتج...' : 'Describe the product...'}
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {formLang === 'ar' ? 'المكونات' : 'Ingredients'}
                  </label>
                  <textarea 
                    rows="3" 
                    value={formLang === 'ar' ? (formData.ingredientsAr || '') : (formData.ingredients || '')} 
                    onChange={(e) => setFormData({...formData, [formLang === 'ar' ? 'ingredientsAr' : 'ingredients']: e.target.value})} 
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" 
                    style={inputStyle} {...inputFocusHandlers}
                    placeholder={formLang === 'ar' ? 'مثال: ماء، جليسرين، حمض الهيالورونيك...' : 'e.g. Aqua, Glycerin, Hyaluronic Acid...'}
                  />
                </div>

                {/* How to Use */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {formLang === 'ar' ? 'طريقة الاستخدام' : 'How to Use'}
                  </label>
                  <textarea 
                    rows="3" 
                    value={formLang === 'ar' ? (formData.howToUseAr || '') : (formData.howToUse || '')} 
                    onChange={(e) => setFormData({...formData, [formLang === 'ar' ? 'howToUseAr' : 'howToUse']: e.target.value})} 
                    className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none" 
                    style={inputStyle} {...inputFocusHandlers}
                    placeholder={formLang === 'ar' ? 'مثال: ضعي 3-4 قطرات على بشرة نظيفة...' : 'e.g. Apply 3-4 drops to cleansed face...'}
                  />
                </div>

                {/* Image Upload */}
                <ImageUpload
                  label="Product Image"
                  value={imagePreview}
                  onChange={handleImageChange}
                />

                {/* Attributes */}
                <div className="pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>Attributes</h3>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'hasOffer', label: 'Has Offer' },
                    ].map(attr => (
                      <label key={attr.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData[attr.key]} onChange={(e) => setFormData({...formData, [attr.key]: e.target.checked})} 
                          className="rounded w-4 h-4" style={{ accentColor: 'var(--gold)' }} />
                        <span className="text-sm" style={{ color: 'var(--foreground)' }}>{attr.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.hasOffer && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Offer Price ($)</label>
                    <input type="number" step="0.01" value={formData.offerPrice} onChange={(e) => setFormData({...formData, offerPrice: e.target.value})} 
                      className="w-full sm:w-1/2 px-4 py-2 rounded-xl outline-none transition-all text-sm" style={inputStyle} {...inputFocusHandlers} />
                  </div>
                )}

                <div className="pt-6 flex justify-end gap-3 sticky bottom-0 mt-6" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-light)' }}>
                  <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' }}>Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4', boxShadow: 'var(--shadow-gold)' }}>
                    <Check className="w-4 h-4" /> Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={() => setIsCategoryModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-md relative z-10 overflow-hidden"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>Manage Categories</h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl outline-none transition-all text-sm"
                    style={inputStyle}
                    {...inputFocusHandlers}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#fdfaf4', boxShadow: 'var(--shadow-gold)' }}
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat}
                      className="p-3 rounded-xl flex items-center justify-between gap-3 text-sm font-medium"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      {editingCategoryIdx === idx ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg outline-none transition-all text-xs"
                            style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground)' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveCategory(idx)}
                            className="px-3 py-1 rounded-lg text-xs"
                            style={{ backgroundColor: 'var(--gold)', color: '#fdfaf4' }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span style={{ color: 'var(--foreground)' }}>{cat}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditCategory(idx)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--foreground-muted)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(idx)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--foreground-muted)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground-muted)'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center py-4 text-xs" style={{ color: 'var(--foreground-muted)' }}>No categories added yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--success)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
          >
            <CheckCircle className="w-4 h-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
