import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree, AlertCircle } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, { name, description, image });
      } else {
        await api.post('/categories', { name, description, image });
      }
      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you certain you wish to delete "${cat.name}"?`)) return;
    try {
      await api.delete(`/categories/${cat._id}`);
      await loadCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
              Boutique Departments
            </span>
            <h1 className="font-serif text-3xl font-bold text-navy-950">
              Manage Categories ({categories.length})
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="btn-gold py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-gold-subtle self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Department
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Loading Categories...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-cream-100 overflow-hidden relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-navy-950/90 text-gold-300 text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold border border-gold-500/30">
                    {cat.productCount} Creations
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-navy-950 mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {cat.description || 'Exclusive haute couture fashion department.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-navy-900 hover:text-gold-600 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md shadow-2xl border border-gold-500/40 overflow-hidden">
              <div className="p-6 bg-navy-950 text-white flex items-center justify-between border-b border-gold-500/30">
                <h3 className="font-serif text-lg font-bold text-gold-300">
                  {editingCategory ? 'Edit Department' : 'Create New Department'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-xs p-3 border-b border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kaftans & Capes"
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Banner Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Editorial description of the category..."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                  />
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 uppercase font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-gold py-2 px-5 uppercase font-bold"
                  >
                    {saving ? 'Saving...' : editingCategory ? 'Save Updates' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
