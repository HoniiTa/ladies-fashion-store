import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  X,
  Check,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    countInStock: 10,
    coverImage: '',
    images: '',
    sizes: 'XS, S, M, L, XL',
    colors: 'Midnight Navy, Champagne Gold',
    material: 'Pure Mulberry Silk & 24K Gold Embroidery',
    description: '',
    careInstructions: 'Specialist dry clean only.',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories'),
      ]);
      setProducts(prodData.products || []);
      setCategories(catData || []);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0]._id : '',
      price: '',
      discountPrice: '',
      countInStock: 10,
      coverImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      images: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      sizes: 'XS, S, M, L, XL',
      colors: 'Midnight Navy, Champagne Gold',
      material: 'Pure Mulberry Silk & Handcrafted Gold Bullion',
      description: '',
      careInstructions: 'Specialist dry clean only. Preserve in protective garment sleeve.',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category?._id || p.category,
      price: p.price,
      discountPrice: p.discountPrice || '',
      countInStock: p.countInStock,
      coverImage: p.coverImage || (p.images && p.images[0]) || '',
      images: p.images ? p.images.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : 'S, M, L',
      colors: p.colors ? p.colors.join(', ') : 'Navy, Gold',
      material: p.material || '',
      description: p.description || '',
      careInstructions: p.careInstructions || '',
      isFeatured: Boolean(p.isFeatured),
      isNewArrival: Boolean(p.isNewArrival),
      isBestSeller: Boolean(p.isBestSeller),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        countInStock: Number(formData.countInStock),
        coverImage: formData.coverImage,
        images: formData.images
          ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [formData.coverImage],
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
        material: formData.material,
        description: formData.description,
        careInstructions: formData.careInstructions,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setDeletingProductId(null);
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
              Inventory & Archive
            </span>
            <h1 className="font-serif text-3xl font-bold text-navy-950">
              Manage Haute Couture Creations ({products.length})
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="btn-gold py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-gold-subtle self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <span className="text-xs text-gray-500 hidden sm:inline-block">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Loading Creations...
              </span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Creation</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold">Badges</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.coverImage}
                            alt=""
                            className="w-12 h-14 object-cover border border-gray-200 bg-cream-50 flex-shrink-0"
                          />
                          <div>
                            <span className="font-serif font-bold text-navy-950 block">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-gray-400 line-clamp-1 font-light max-w-xs">
                              {p.material}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {p.categoryName || (p.category && p.category.name)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-navy-950">
                          ${p.discountPrice ? p.discountPrice : p.price}
                        </span>
                        {p.discountPrice && (
                          <span className="text-gray-400 line-through text-[11px] block">
                            ${p.price}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.countInStock <= 5 ? 'text-amber-600' : 'text-emerald-700'
                          }`}
                        >
                          {p.countInStock} Units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && (
                            <span className="bg-gold-100 text-gold-800 text-[9px] uppercase px-1.5 py-0.5 font-bold">
                              Featured
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="bg-navy-950 text-gold-300 text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                              New
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-navy-900 hover:text-gold-600 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add / Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="bg-white w-full max-w-3xl shadow-2xl border border-gold-500/40 my-8 overflow-hidden">
              <div className="p-6 bg-navy-950 text-white flex items-center justify-between border-b border-gold-500/30">
                <h3 className="font-serif text-xl font-bold text-gold-300">
                  {editingProduct ? 'Edit Couture Creation' : 'Catalogue New Creation'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-4 border-b border-red-200">
                  {formError}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Creation Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Royal Sovereign Silk Gown"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Regular Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="450.00"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Sale / Discount Price ($ optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                      placeholder="395.00"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Units In Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.countInStock}
                      onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Primary Cover Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Additional Images (Comma separated URLs)
                    </label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                      placeholder="https://..., https://..."
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Available Sizes (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="XS, S, M, L, XL"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Color Palette (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="Midnight Navy, Champagne Gold"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Material / Fabric Composition
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="e.g. 100% Pure Mulberry Silk & Gold Bullion"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Artisan description of cut, drape, and silhouette..."
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Care & Preservation Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.careInstructions}
                      onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-semibold text-navy-950">Showcase in Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNewArrival}
                        onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                        className="rounded text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-semibold text-navy-950">Mark as New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                        className="rounded text-gold-600 focus:ring-gold-500"
                      />
                      <span className="font-semibold text-navy-950">Mark as Best Seller</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 uppercase tracking-wider font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold py-2.5 px-6 font-bold uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Save Updates' : 'Add Creation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProductId && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-6 sm:p-8 max-w-sm w-full border border-red-300 text-center shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-navy-950 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Are you sure you wish to permanently withdraw this creation from the archive?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(deletingProductId)}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-xs uppercase font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
