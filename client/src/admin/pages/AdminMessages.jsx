import React, { useState, useEffect } from 'react';
import { FiMail, FiCheck, FiCornerDownRight, FiTrash2, FiSend } from 'react-icons/fi';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const [loading, setLoading] = useState(true);

  // Reply Modal
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminService.getMessages();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await adminService.markMessageAsRead(id);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
        );
        toast.success('Marked as read');
      }
    } catch (err) {
      toast.error('Failed to mark message as read');
    }
  };

  const openReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText('');
    setIsReplyOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Please write a reply');
      return;
    }

    try {
      setSendingReply(true);
      const res = await adminService.replyMessage(selectedMessage._id, replyText);
      if (res.success) {
        toast.success(res.message || 'Reply sent & dispatched via email!');
        setIsReplyOpen(false);
        fetchMessages();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const res = await adminService.deleteMessage(id);
      if (res.success) {
        toast.success('Message deleted');
        setMessages((prev) => prev.filter((m) => m._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const filtered =
    filter === 'unread' ? messages.filter((m) => !m.isRead) : messages;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Messages & Inquiries Inbox
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Read portfolio inquiries, dispatch email replies via Nodemailer, and review full discussion threads.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-brand-500 text-white shadow-glowSm'
                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filter === 'unread'
                ? 'bg-brand-500 text-white shadow-glowSm'
                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300'
            }`}
          >
            Unread ({messages.filter((m) => !m.isRead).length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-400">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-3xl border transition-all ${
                !msg.isRead
                  ? 'border-brand-500/60 bg-brand-50/20 dark:bg-brand-950/20 shadow-md'
                  : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-dark-border mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {msg.name}
                  </span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-brand-500 hover:underline"
                  >
                    &lt;{msg.email}&gt;
                  </a>
                  {!msg.isRead && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white">
                      Unread
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Subject: {msg.subject}
                </h4>
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap p-3.5 rounded-xl bg-gray-50 dark:bg-dark-surface">
                  {msg.message}
                </p>
              </div>

              {/* Replies History */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-border space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-500">
                    Dispatched Replies ({msg.replies.length})
                  </p>
                  {msg.replies.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-brand-500 font-semibold">
                        <span>Replied by: {r.repliedBy || 'Praveen Rai'}</span>
                        <span className="font-mono text-gray-400">
                          {new Date(r.repliedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {r.replyText}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-dark-border">
                {!msg.isRead && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={FiCheck}
                    onClick={() => handleMarkRead(msg._id)}
                  >
                    Mark Read
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  icon={FiCornerDownRight}
                  onClick={() => openReplyModal(msg)}
                >
                  Reply by Email
                </Button>

                <button
                  type="button"
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Delete message"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        title={`Reply to ${selectedMessage?.name || 'Inquiry'}`}
      >
        <form onSubmit={handleSendReply} className="space-y-4">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-surface text-xs space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              To: {selectedMessage?.email}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Subject: Re: {selectedMessage?.subject}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Email Response Body *
            </label>
            <textarea
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              placeholder="Hi there, thank you for reaching out..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Button variant="secondary" size="md" onClick={() => setIsReplyOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={FiSend}
              isLoading={sendingReply}
            >
              Send & Dispatch Email
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMessages;
