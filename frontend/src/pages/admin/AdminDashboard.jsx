import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((data) => setStats(data))
      .catch((err) => console.error('Admin stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
              Executive Overview
            </span>
            <h1 className="font-serif text-3xl font-bold text-navy-950">
              Maison Intelligence & Sales Dashboard
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="btn-gold py-2 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              + Add Product
            </Link>
            <Link
              to="/admin/orders"
              className="btn-navy py-2 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              Manage Orders
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-serif uppercase tracking-widest text-gray-500">
              Aggregating Metrics...
            </span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                    Total Revenue
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-950">
                    ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0.00'}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> Confirmed Gross Sales
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-600 border border-gold-500/30 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                    Total Orders
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-950">
                    {stats?.totalOrders || 0}
                  </h3>
                  <span className="text-[10px] text-gold-600 font-medium mt-1 block">
                    Across All Boutiques
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-navy-900/10 text-navy-900 border border-navy-900/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              {/* Products in Catalog */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                    Active Catalog
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-950">
                    {stats?.totalProducts || 0}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                    {stats?.totalCategories || 0} Departments
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-cream-200 text-gold-700 border border-gold-500/30 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              {/* Registered Customers */}
              <div className="bg-white border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-1">
                    Registered Clients
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-navy-950">
                    {stats?.totalUsers || 0}
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                    Verified High Value Patrons
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-gold-50 text-gold-600 border border-gold-400/30 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Middle Section: Recent Orders & Stock Watch */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders Table */}
              <div className="lg:col-span-8 bg-white border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
                  <h3 className="font-serif text-lg font-bold text-navy-950">
                    Recent Orders Dispatch
                  </h3>
                  <Link
                    to="/admin/orders"
                    className="text-xs uppercase tracking-wider text-gold-600 hover:text-navy-950 font-semibold"
                  >
                    View All Orders &rarr;
                  </Link>
                </div>

                {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No orders recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                          <th className="py-2.5 font-semibold">Order ID</th>
                          <th className="py-2.5 font-semibold">Client</th>
                          <th className="py-2.5 font-semibold">Total</th>
                          <th className="py-2.5 font-semibold">Status</th>
                          <th className="py-2.5 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.recentOrders.map((ord) => (
                          <tr key={ord._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 font-mono font-medium text-navy-950">
                              {ord._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="py-3 text-gray-700">
                              {ord.shippingAddress?.fullName || ord.user?.name || 'Patron'}
                            </td>
                            <td className="py-3 font-semibold text-navy-950">
                              ${ord.totalPrice.toFixed(2)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  ord.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : ord.orderStatus === 'Shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 text-gray-400 text-[11px]">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Low Stock Watch */}
              <div className="lg:col-span-4 bg-white border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="font-serif text-lg font-bold text-navy-950">
                      Inventory Replenishment Alert
                    </h3>
                  </div>

                  {!stats?.lowStockProducts || stats.lowStockProducts.length === 0 ? (
                    <p className="text-xs text-emerald-700 py-4 font-medium">
                      All couture inventory levels are adequately stocked.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {stats.lowStockProducts.map((p) => (
                        <div key={p._id} className="py-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.coverImage}
                              alt=""
                              className="w-10 h-12 object-cover border border-gray-200"
                            />
                            <div>
                              <p className="font-semibold text-navy-950 line-clamp-1">{p.name}</p>
                              <span className="text-gray-400 text-[11px]">${p.price}</span>
                            </div>
                          </div>
                          <span className="text-amber-700 font-bold px-2 py-1 bg-amber-50 border border-amber-200 text-[11px]">
                            {p.countInStock} Left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <Link
                    to="/admin/products"
                    className="w-full btn-navy text-center py-2 text-xs block"
                  >
                    Adjust Product Inventory
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
