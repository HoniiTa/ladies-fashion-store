import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Trash2, Search } from 'lucide-react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/users');
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change role of ${u.name} to ${newRole.toUpperCase()}?`)) return;

    try {
      await api.put(`/users/${u._id}/role`, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer account?')) return;
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="pb-6 border-b border-gray-200 mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-mono font-bold block mb-1">
            Clientele Registry
          </span>
          <h1 className="font-serif text-3xl font-bold text-navy-950">
            Manage Customers & Access Roles ({users.length})
          </h1>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 p-4 mb-6 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search patrons by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 focus:outline-none focus:border-gold-500 bg-cream-50"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs uppercase tracking-widest text-gray-500">
                Loading Customers...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Client Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Telephone</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Enrolled</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border border-gold-500/40 overflow-hidden bg-navy-100 flex items-center justify-center flex-shrink-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                          <span className="font-semibold text-navy-950">{u.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3.5 px-4 text-gray-500">{u.phone || '—'}</td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border rounded transition-colors ${
                            u.role === 'admin'
                              ? 'bg-gold-500/20 text-gold-700 border-gold-400 hover:bg-gold-500 hover:text-navy-950'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                          }`}
                          title="Click to toggle role"
                        >
                          {u.role === 'admin' ? 'Store Admin' : 'Customer'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
