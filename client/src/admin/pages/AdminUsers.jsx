import React, { useState, useEffect } from 'react';
import { FiSearch, FiSlash, FiCheck, FiTrash2, FiUsers, FiShield } from 'react-icons/fi';
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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiUsers className="w-3.5 h-3.5" />
            ACCESS CONTROL &amp; ACCOUNTS
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Registered Users Manager
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Search accounts, toggle active/blocked status, or manage user data.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-theme-textMuted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, institution..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />
        </form>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : users.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted">
          No registered users found matching your search.
        </div>
      ) : (
        <div className="rounded-3xl border border-theme-border bg-theme-surface overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-theme-surfaceSecondary border-b border-theme-border text-theme-textMuted uppercase font-mono font-bold tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">College / Company</th>
                  <th className="p-4">Bookmarks</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-theme-surfaceSecondary/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-theme-border"
                      />
                      <div>
                        <p className="font-heading font-bold text-theme-text">
                          {u.name}
                        </p>
                        <p className="text-[11px] font-mono text-theme-textMuted">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-theme-text font-medium">
                      {u.collegeOrCompany || '—'}
                    </td>
                    <td className="p-4 font-mono font-bold text-indigo-500">
                      {u.savedProjects?.length || 0}
                    </td>
                    <td className="p-4 text-theme-textMuted font-mono">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      {u.isBlocked ? (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(u._id)}
                        className={`p-2 rounded-xl transition-colors border ${
                          u.isBlocked
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white'
                        }`}
                        title={u.isBlocked ? 'Unblock user' : 'Block user'}
                      >
                        {u.isBlocked ? <FiCheck className="w-4 h-4" /> : <FiSlash className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
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
