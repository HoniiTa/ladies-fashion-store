import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await api.get('/reviews');
      setReviews(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you wish to delete this customer critique?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      await loadReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="pb-6 border-b border-gray-200 mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
            Quality Assurance & Critiques
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-950">
            Client Reviews Moderation ({reviews.length})
          </h1>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Loading Reviews...
              </span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No customer reviews submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-6 hover:bg-gray-50/60 transition-colors flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex text-gold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-serif font-bold text-navy-950 text-sm">
                        {rev.title}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed font-light">
                      “{rev.comment}”
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-gray-400">
                      <span>By: <strong className="text-navy-900">{rev.userName}</strong> ({rev.user?.email})</span>
                      <span>•</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0">
                    {rev.product && (
                      <Link
                        to={`/product/${rev.product._id || rev.product.slug}`}
                        target="_blank"
                        className="text-xs text-gold-600 hover:text-navy-950 flex items-center gap-1 font-medium"
                      >
                        <span>{rev.product.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 p-1"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
