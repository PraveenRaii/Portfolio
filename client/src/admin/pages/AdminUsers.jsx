import React, { useState, useEffect } from 'react';
import { FiSearch, FiSlash, FiCheck, FiTrash2, FiUsers } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (query = '') => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(query);
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(search);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await adminService.toggleBlockUser(id);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: res.isBlocked } : u))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user block status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Registered Users Manager
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Search, block/unblock, or delete user accounts registered on your portfolio.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, college..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-400">
          No registered users found matching your search.
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">College / Company</th>
                  <th className="p-4">Saved Projects</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-surface/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-brand-500/20"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      {u.collegeOrCompany || '—'}
                    </td>
                    <td className="p-4 font-mono font-semibold text-brand-500">
                      {u.savedProjects?.length || 0}
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {u.isBlocked ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-500">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(u._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          u.isBlocked
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                        }`}
                        title={u.isBlocked ? 'Unblock user' : 'Block user'}
                      >
                        {u.isBlocked ? <FiCheck className="w-4 h-4" /> : <FiSlash className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete user"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
