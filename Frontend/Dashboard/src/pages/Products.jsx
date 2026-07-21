import React, { useState, useEffect } from 'react';
import { productsData, categoriesData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Check, FolderOpen, CheckCircle, AlertTriangle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import Loader from '../components/Loader';
import { useLanguage } from '../context/LanguageContext';

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
  const [products, setProducts] = useState([]);
  const [formLang, setFormLang] = useState('en');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '', nameAr: '', tagline: '', taglineAr: '', price: '', stock: '', category: '', description: '', descriptionAr: '',
    ingredients: '', ingredientsAr: '', howToUse: '', howToUseAr: '',
    isNewArrival: false, isBestSeller: false, hasOffer: false, offerPrice: '', image: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = async (currentCategories = categories) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map(p => {
          const catObj = currentCategories.find(c => c._id === p.category || c.name === p.category);
          return {
            id: p._id,
            name: p.name?.en || '',
            nameAr: p.name?.ar || '',
            tagline: p.tagline?.en || '',
            taglineAr: p.tagline?.ar || '',
            category: catObj ? catObj.name : (p.category?.name || p.category || ''),
            price: p.price,
            stock: p.stock,
            description: p.description?.en || '',
            descriptionAr: p.description?.ar || '',
            ingredients: p.ingredients?.en || '',
            ingredientsAr: p.ingredients?.ar || '',
            howToUse: p.howToUse?.en || '',
            howToUseAr: p.howToUse?.ar || '',
            isNewArrival: p.isNewArrival,
            isBestSeller: p.isBestSeller,
            hasOffer: p.hasOffer,
            offerPrice: p.offerPrice || '',
            image: p.image || ''
          };
        });
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      if (response.ok) {
        const cats = await response.json();
        setCategories(cats);
        if (cats.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: cats[0].name }));
        }
        await fetchProducts(cats);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setImagePreview(product.image || '');
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', nameAr: '', tagline: '', taglineAr: '', price: '', stock: '', category: categories[0]?.name || '', description: '', descriptionAr: '',
        ingredients: '', ingredientsAr: '', howToUse: '', howToUseAr: '',
        isNewArrival: false, isBestSeller: false, hasOffer: false, offerPrice: '', image: ''
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setDragOver(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSavingProduct) return;
    setIsSavingProduct(true);
    const token = localStorage.getItem('adminToken');
    
    // Find category ID
    const catObj = categories.find(c => c.name === formData.category || c._id === formData.category);
    const categoryId = catObj ? catObj._id : formData.category;

    const payload = {
      name: {
        en: formData.name || '',
        ar: formData.nameAr || ''
      },
      tagline: {
        en: formData.tagline || '',
        ar: formData.taglineAr || ''
      },
      category: categoryId,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: {
        en: formData.description || '',
        ar: formData.descriptionAr || ''
      },
      ingredients: {
        en: formData.ingredients || '',
        ar: formData.ingredientsAr || ''
      },
      howToUse: {
        en: formData.howToUse || '',
        ar: formData.howToUseAr || ''
      },
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
      hasOffer: formData.hasOffer,
      offerPrice: formData.hasOffer && formData.offerPrice ? Number(formData.offerPrice) : undefined,
      image: imagePreview || formData.image
    };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`${import.meta.env.VITE_API_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        showToast(editingProduct ? t('productUpdatedMsg', { name: formData.name }) : t('productAddedMsg', { name: formData.name }));
        handleCloseModal();
        fetchCategories(); // Re-fetch to update table
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Category management handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (isSavingCategory) return;
    setIsSavingCategory(true);
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      alert(language === 'ar' ? 'الفئة موجودة بالفعل!' : 'Category already exists!');
      setIsSavingCategory(false);
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    const id = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, name: newCategoryName.trim() })
      });
      if (response.ok) {
        const newCat = await response.json();
        setCategories([...categories, newCat]);
        setNewCategoryName('');
        showToast(language === 'ar' ? 'تمت إضافة الفئة بنجاح.' : 'Category added successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to add category');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleEditCategory = (idx) => {
    setEditingCategoryIdx(idx);
    setEditingCategoryName(categories[idx].name);
  };

  const handleSaveCategory = async (idx) => {
    if (!editingCategoryName.trim()) return;
    if (isSavingCategory) return;
    setIsSavingCategory(true);
    const catToUpdate = categories[idx];
    const token = localStorage.getItem('adminToken');
    const id = editingCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${catToUpdate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, name: editingCategoryName.trim() })
      });
      if (response.ok) {
        const updatedCat = await response.json();
        const updated = [...categories];
        updated[idx] = updatedCat;
        setCategories(updated);
        setEditingCategoryIdx(null);
        showToast(language === 'ar' ? 'تم تعديل الفئة بنجاح.' : 'Category updated successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update category');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (idx) => {
    const catToDelete = categories[idx];
    const confirmMsg = language === 'ar' 
      ? `هل أنت متأكد من حذف الفئة "${catToDelete.name}"؟` 
      : `Are you sure you want to delete category "${catToDelete.name}"?`;
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${catToDelete._id}?lang=${language}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setCategories(categories.filter((_, i) => i !== idx));
        showToast(language === 'ar' ? 'تم حذف الفئة بنجاح.' : 'Category deleted successfully.', 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        showToast(errData.message || (language === 'ar' ? 'فشل حذف الفئة.' : 'Failed to delete category.'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.', 'error');
    }
  };

  const handleImageChange = (val) => {
    setImagePreview(val);
    setFormData(prev => ({ ...prev, image: val }));
  };

  const handleDelete = async (id) => {
    const confirmMsg = language === 'ar' 
      ? 'هل أنت متأكد من حذف هذا المنتج؟' 
      : 'Are you sure you want to delete this product?';
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast(language === 'ar' ? 'تم حذف المنتج بنجاح.' : 'Product deleted successfully.');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم.' : 'Server communication error.');
    }
  };

  const filteredProducts = products.filter(p => {
    const nameMatch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const nameArMatch = p.nameAr?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || nameArMatch;
  });

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
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{t('productManagement')}</h1>
          {!isLoading && (
            <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--gold)', border: '1px solid var(--border)' }}>
              {products.length} {language === 'ar' ? 'منتج' : 'Products'}
            </div>
          )}
        </div>
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
            {t('categories')}
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ 
              background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
              color: 'var(--gold-text)',
              boxShadow: 'var(--shadow-gold)'
            }}
          >
            <Plus className="w-5 h-5" />
            {t('addProduct')}
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)', border: '1px solid var(--border-light)' }}>
        <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <Search className="w-5 h-5" style={{ color: 'var(--foreground-muted)' }} />
          <input 
            type="text" 
            placeholder={t('searchProducts')} 
            className="w-full sm:max-w-xs outline-none text-sm bg-transparent"
            style={{ color: 'var(--foreground)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('products')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('category')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('price')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{t('stock')}</th>
                <th className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{language === 'ar' ? 'السمات' : 'Attributes'}</th>
                <th className="p-4 font-medium text-sm text-end" style={{ color: 'var(--foreground-secondary)' }}>{t('actions')}</th>
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
                    <img src={product.image || 'https://via.placeholder.com/40'} alt={language === 'ar' ? (product.nameAr || product.name) : product.name} className="w-10 h-10 rounded-lg object-cover" style={{ backgroundColor: 'var(--pearl)', border: '1px solid var(--border-light)' }} />
                    <div>
                      <span className="font-medium block" style={{ color: 'var(--foreground)' }}>
                        {language === 'ar' ? (product.nameAr || product.name) : product.name}
                      </span>
                      {(product.description || product.descriptionAr) && (
                        <span className="text-xs truncate block max-w-[200px]" style={{ color: 'var(--foreground-muted)' }}>
                          {language === 'ar' ? (product.descriptionAr || product.description) : product.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-start" style={{ color: 'var(--foreground-secondary)' }}>{product.category}</td>
                  <td className="p-4 font-medium text-sm text-start" style={{ color: 'var(--foreground)' }}>
                    {product.hasOffer ? (
                      <div>
                        <span style={{ textDecoration: 'line-through', color: 'var(--foreground-muted)' }}>
                          {product.price} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                        <span className="mx-2" style={{ color: 'var(--success)' }}>
                          {product.offerPrice} {language === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                      </div>
                    ) : (
                      `${product.price} ${language === 'ar' ? 'ج.م' : 'EGP'}`
                    )}
                  </td>
                  <td className="p-4 text-sm text-start" style={{ color: product.stock < 50 ? 'var(--destructive)' : 'var(--foreground-secondary)', fontWeight: product.stock < 50 ? 700 : 400 }}>
                    {product.stock}
                  </td>
                  <td className="p-4 text-start">
                    <div className="flex flex-wrap gap-2">
                      {product.isNewArrival && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-new-bg)', color: 'var(--badge-new-text)' }}>{language === 'ar' ? 'جديد' : 'New'}</span>}
                      {product.isBestSeller && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-best-bg)', color: 'var(--badge-best-text)' }}>{language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}</span>}
                      {product.hasOffer && <span className="px-2 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--badge-offer-bg)', color: 'var(--badge-offer-text)' }}>{language === 'ar' ? 'عرض' : 'Offer'}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-end">
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
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader className="scale-150" />
              <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--foreground-muted)' }}>
                {language === 'ar' ? 'جاري تحميل المنتجات...' : 'Loading products...'}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--foreground-muted)' }}>{t('noData')}</div>
          ) : null}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'var(--overlay)' }} onClick={handleCloseModal} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-4xl relative z-10 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between sticky top-0 z-20" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>
                    {editingProduct ? t('updateProduct') : t('addProduct')}
                  </h2>
                </div>
                <button onClick={handleCloseModal} className="p-2 rounded-full transition-colors" style={{ color: 'var(--foreground-muted)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--pearl)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* Bilingual Fields Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: English (Required) */}
                  <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--gold)' }}>
                      🇬🇧 English Details (Required)
                    </h3>
                    
                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Product Name *
                      </label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Tagline
                      </label>
                      <input 
                        type="text" 
                        value={formData.tagline || ''} 
                        onChange={(e) => setFormData({...formData, tagline: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers}
                        placeholder="e.g. Calm · Restore · Glow" />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Description
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="Describe the product..."
                      />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Ingredients
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.ingredients || ''} 
                        onChange={(e) => setFormData({...formData, ingredients: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="e.g. Aqua, Glycerin, Hyaluronic Acid..."
                      />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        How to Use
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.howToUse || ''} 
                        onChange={(e) => setFormData({...formData, howToUse: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="e.g. Apply 3-4 drops to cleansed face..."
                      />
                    </div>
                  </div>

                  {/* Right Column: Arabic (Optional) */}
                  <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--gold)' }}>
                      🇸🇦 البيانات بالعربية (اختياري - تترجم تلقائياً)
                    </h3>
                    
                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        اسم المنتج
                      </label>
                      <input 
                        type="text" 
                        value={formData.nameAr || ''} 
                        onChange={(e) => setFormData({...formData, nameAr: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        الشعار الفرعي (عبارة قصيرة)
                      </label>
                      <input 
                        type="text" 
                        value={formData.taglineAr || ''} 
                        onChange={(e) => setFormData({...formData, taglineAr: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers}
                        placeholder="مثال: ترطيب · نضارة · تجديد" />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        الوصف
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.descriptionAr || ''} 
                        onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="اكتب وصفاً للمنتج..."
                      />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        المكونات
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.ingredientsAr || ''} 
                        onChange={(e) => setFormData({...formData, ingredientsAr: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="مثال: ماء، جليسرين، حمض الهيالورونيك..."
                      />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        طريقة الاستخدام
                      </label>
                      <textarea 
                        rows="3" 
                        value={formData.howToUseAr || ''} 
                        onChange={(e) => setFormData({...formData, howToUseAr: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm resize-none text-start" 
                        style={inputStyle} {...inputFocusHandlers}
                        placeholder="مثال: ضعي 3-4 قطرات على بشرة نظيفة..."
                      />
                    </div>
                  </div>
                </div>

                {/* Global Product Fields Section */}
                <div className="p-4 rounded-xl space-y-6" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-start" style={{ color: 'var(--gold)' }}>
                    {language === 'ar' ? '⚙️ البيانات العامة للمنتج' : '⚙️ General Product Info'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {t('category')} *
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
                          <option key={cat._id || cat.id || cat} value={cat.name || cat}>{cat.name || cat}</option>
                        ))}
                        {categories.length === 0 && (
                          <option value="">No categories available</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {t('price')} ({language === 'ar' ? 'ج.م' : 'EGP'}) *
                      </label>
                      <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                    </div>

                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        {t('stock')} *
                      </label>
                      <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} 
                        className="w-full px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="text-start">
                    <ImageUpload
                      label={t('image')}
                      value={imagePreview}
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Attributes */}
                  <div className="pt-4 text-start" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'السمات' : 'Attributes'}</h3>
                    <div className="flex flex-wrap gap-6">
                      {[
                        { key: 'isNewArrival', label: language === 'ar' ? 'وصل حديثاً' : 'New Arrival' },
                        { key: 'isBestSeller', label: language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller' },
                        { key: 'hasOffer', label: language === 'ar' ? 'يوجد عرض' : 'Has Offer' },
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
                    <div className="space-y-2 text-start">
                      <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{t('offerPrice')} ({language === 'ar' ? 'ج.م' : 'EGP'})</label>
                      <input type="number" step="0.01" value={formData.offerPrice} onChange={(e) => setFormData({...formData, offerPrice: e.target.value})} 
                        className="w-full sm:w-1/2 px-4 py-2 rounded-xl outline-none transition-all text-sm text-start" style={inputStyle} {...inputFocusHandlers} />
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-end gap-3 sticky bottom-0 mt-6" style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border-light)' }}>
                  <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-xl font-medium transition-colors text-sm"
                    style={{ backgroundColor: 'var(--pearl)', color: 'var(--foreground-secondary)' }}>{t('cancel')}</button>
                  <button 
                    type="submit" 
                    disabled={isSavingProduct}
                    className="px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', 
                      color: 'var(--gold-text)', 
                      boxShadow: 'var(--shadow-gold)',
                      opacity: isSavingProduct ? 0.7 : 1,
                      cursor: isSavingProduct ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSavingProduct ? (
                      <>
                        <Loader />
                        <span>{language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> <span>{t('confirm')}</span>
                      </>
                    )}
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
                <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--foreground)' }}>{language === 'ar' ? 'إدارة الفئات' : 'Manage Categories'}</h2>
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
                    placeholder={language === 'ar' ? 'اسم فئة جديدة...' : 'New category name...'}
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl outline-none transition-all text-sm text-start"
                    style={inputStyle}
                    {...inputFocusHandlers}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSavingCategory}
                    className="px-4 py-2 rounded-xl font-medium transition-colors text-sm flex items-center gap-1.5"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', 
                      color: 'var(--gold-text)', 
                      boxShadow: 'var(--shadow-gold)',
                      opacity: isSavingCategory ? 0.7 : 1,
                      cursor: isSavingCategory ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSavingCategory ? (
                      <Loader />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat._id || cat.id || idx}
                      className="p-3 rounded-xl flex items-center justify-between gap-3 text-sm font-medium"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      {editingCategoryIdx === idx ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="flex-1 px-3 py-1 rounded-lg outline-none transition-all text-xs text-start"
                            style={{ backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground)' }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveCategory(idx)}
                            disabled={isSavingCategory}
                            className="px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                            style={{ 
                              backgroundColor: 'var(--gold)', 
                              color: 'var(--gold-text)',
                              opacity: isSavingCategory ? 0.7 : 1,
                              cursor: isSavingCategory ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {isSavingCategory && <Loader />}
                            <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span style={{ color: 'var(--foreground)' }}>{cat.name}</span>
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
                    <p className="text-center py-4 text-xs" style={{ color: 'var(--foreground-muted)' }}>{language === 'ar' ? 'لا توجد فئات مضافة بعد.' : 'No categories added yet.'}</p>
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
            className="fixed bottom-6 end-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
            style={{ 
              backgroundColor: 'var(--surface)', 
              color: toast.type === 'error' ? 'var(--destructive)' : 'var(--success)', 
              boxShadow: 'var(--shadow-lg)', 
              border: `1px solid ${toast.type === 'error' ? 'var(--destructive)' : 'var(--border)'}` 
            }}
          >
            {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
