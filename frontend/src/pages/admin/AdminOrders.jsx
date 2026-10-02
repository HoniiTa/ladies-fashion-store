import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Eye,
  X,
  Edit,
} from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for viewing or editing
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.get('/orders');
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrderModal = (ord) => {
    setSelectedOrder(ord);
    setEditStatus(ord.orderStatus);
    setEditTracking(ord.trackingNumber || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      await api.put(`/orders/${selectedOrder._id}/status`, {
        status: editStatus,
        trackingNumber: editTracking,
      });
      setSelectedOrder(null);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;
    const matchesSearch =
      ord._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="pb-6 border-b border-gray-200 mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
            Fulfillment & Logistics
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-950">
            Client Orders Management ({orders.length})
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Order ID, client, tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 border uppercase tracking-wider font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-navy-950 text-gold-300 border-navy-950'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gold-500'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Loading Client Orders...
              </span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">
              No orders found matching the filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Client Name</th>
                    <th className="py-3 px-4 font-semibold">Creations</th>
                    <th className="py-3 px-4 font-semibold">Total Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Tracking Code</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                        {ord._id.slice(-6).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-navy-950 block">
                          {ord.shippingAddress?.fullName || ord.user?.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        {ord.orderItems?.length} {ord.orderItems?.length === 1 ? 'item' : 'items'}
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-navy-950">
                        ${ord.totalPrice.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gold-700 font-semibold">
                        {ord.trackingNumber}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openOrderModal(ord)}
                          className="bg-navy-900 text-gold-300 hover:bg-gold-500 hover:text-navy-950 text-xs px-3 py-1.5 uppercase font-semibold tracking-wider transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inspect / Update Order Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl shadow-2xl border border-gold-500/40 my-8 overflow-hidden">
              <div className="p-6 bg-navy-950 text-white flex items-center justify-between border-b border-gold-500/30">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gold-300">
                    Order Details #{selectedOrder._id}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
                {/* Shipping & Payment summary */}
                <div className="grid grid-cols-2 gap-4 bg-cream-50 p-4 border border-gold-500/20">
                  <div>
                    <h4 className="font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Client Destination:
                    </h4>
                    <p className="text-gray-700">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-gray-500">{selectedOrder.shippingAddress?.street}</p>
                    <p className="text-gray-500">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                      {selectedOrder.shippingAddress?.postalCode}
                    </p>
                    <p className="text-gray-500">{selectedOrder.shippingAddress?.country}</p>
                    <p className="text-navy-900 mt-1">Tel: {selectedOrder.shippingAddress?.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold uppercase tracking-wider text-navy-950 mb-1">
                      Billing Summary:
                    </h4>
                    <p className="text-gray-700">Payment: <strong>{selectedOrder.paymentMethod}</strong></p>
                    <p className="text-gray-700">
                      Status:{' '}
                      <span className={selectedOrder.isPaid ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                        {selectedOrder.isPaid ? 'PAID' : 'PENDING PAYMENT'}
                      </span>
                    </p>
                    <p className="font-serif text-sm font-bold text-navy-950 mt-2">
                      Total: ${selectedOrder.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Ordered Items */}
                <div>
                  <h4 className="font-serif text-base font-bold text-navy-950 mb-3">
                    Ordered Creations ({selectedOrder.orderItems?.length})
                  </h4>
                  <div className="divide-y divide-gray-100 border border-gray-200">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-12 object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-semibold text-navy-950 block">{item.name}</span>
                            <span className="text-[11px] text-gray-500">
                              Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-navy-950">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Tracking updater form */}
                <form onSubmit={handleUpdateStatus} className="border-t border-gray-200 pt-4 space-y-4">
                  <h4 className="font-serif text-base font-bold text-navy-950">
                    Update Fulfillment & Logistics
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                        Dispatch Status:
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-navy-950 mb-1">
                        Courier Tracking Number:
                      </label>
                      <input
                        type="text"
                        value={editTracking}
                        onChange={(e) => setEditTracking(e.target.value)}
                        placeholder="LUXE-12345678"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 uppercase font-semibold"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn-gold py-2 px-6 uppercase font-bold"
                    >
                      {updating ? 'Updating...' : 'Save Dispatch Updates'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
