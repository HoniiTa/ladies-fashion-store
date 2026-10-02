import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters state
  const currentCategory = searchParams.get('category') || 'all';
  const currentKeyword = searchParams.get('keyword') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [keywordInput, setKeywordInput] = useState(currentKeyword);
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    // Load categories for filter bar
    api.get('/categories')
      .then((data) => setCategories(data || []))
      .catch((err) => console.error('Categories error:', err));
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (currentCategory && currentCategory !== 'all') queryParams.append('category', currentCategory);
        if (currentKeyword) queryParams.append('keyword', currentKeyword);
        if (currentSort) queryParams.append('sort', currentSort);
        if (currentMinPrice) queryParams.append('minPrice', currentMinPrice);
        if (currentMaxPrice) queryParams.append('maxPrice', currentMaxPrice);
        queryParams.append('page', currentPage);
        queryParams.append('limit', 12);

        const data = await api.get(`/products?${queryParams.toString()}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', 1); // Reset to page 1 on filter change
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('keyword', keywordInput);
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (minPriceInput) params.set('minPrice', minPriceInput);
    else params.delete('minPrice');

    if (maxPriceInput) params.set('maxPrice', maxPriceInput);
    else params.delete('maxPrice');

    params.set('page', 1);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setKeywordInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-gold-500/40 bg-white">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-navy-950 font-semibold">
            The Haute Couture Collection
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-navy-950 mb-3">
          {currentCategory !== 'all' ? `${currentCategory}` : 'Shop All Creations'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto font-light">
          Explore our complete catalogue of handcrafted silk gowns, royal abayas, and accessories.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-gray-200">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all whitespace-nowrap ${
              currentCategory === 'all'
                ? 'bg-navy-950 text-gold-300 border-navy-950 font-bold shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gold-500'
            }`}
          >
            All Creations ({totalProducts})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam('category', cat.name)}
              className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all whitespace-nowrap ${
                currentCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-navy-950 text-gold-300 border-navy-950 font-bold shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gold-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="bg-white border border-gray-200 p-4 mb-8 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Search by name, fabric, style..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </form>

          {/* Price Range Filter */}
          <form onSubmit={handlePriceFilterSubmit} className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price:</span>
            <input
              type="number"
              placeholder="Min $"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-20 px-2 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 text-center"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-20 px-2 py-1.5 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 text-center"
            />
            <button
              type="submit"
              className="bg-navy-900 text-gold-300 hover:bg-gold-500 hover:text-navy-950 text-xs px-3 py-1.5 uppercase tracking-wider font-semibold transition-colors"
            >
              Apply
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Sort By:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="text-xs border border-gray-300 px-3 py-1.5 bg-white focus:outline-none focus:border-gold-500 font-medium"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {(currentCategory !== 'all' || currentKeyword || currentMinPrice || currentMaxPrice) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold pl-2 border-l border-gray-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
            <span className="font-serif uppercase tracking-widest text-xs text-gray-500">
              Curating Products...
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center shadow-sm my-8">
            <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-navy-950 mb-2">
              No matching creations found
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
              We could not find any products matching your current filters. Try resetting the
              filter parameters or search for a different item.
            </p>
            <button onClick={clearAllFilters} className="btn-gold">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => updateParam('page', pageNum)}
                  className={`w-10 h-10 text-xs font-semibold uppercase tracking-wider border transition-all ${
                    currentPage === pageNum
                      ? 'bg-navy-950 text-gold-300 border-navy-950 shadow-md font-bold'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gold-500'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
