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
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
            <FiMail className="w-3.5 h-3.5" />
            COMMUNICATION INBOX
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-theme-text">
            Messages &amp; Inquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
            Read contact inquiries, dispatch direct email replies, and review conversation logs.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-glowSm'
                : 'bg-theme-surfaceSecondary border border-theme-border text-theme-textMuted hover:text-theme-text'
            }`}
          >
            All Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white shadow-glowSm'
                : 'bg-theme-surfaceSecondary border border-theme-border text-theme-textMuted hover:text-theme-text'
            }`}
          >
            Unread ({messages.filter((m) => !m.isRead).length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-3xl border transition-all ${
                !msg.isRead
                  ? 'border-indigo-500/50 bg-indigo-500/5 shadow-card hover:border-indigo-500'
                  : 'border-theme-border bg-theme-surface shadow-card hover:border-theme-border/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-theme-border mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-theme-text">
                    {msg.name}
                  </span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono text-indigo-500 hover:underline"
                  >
                    &lt;{msg.email}&gt;
                  </a>
                  {!msg.isRead && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">
                      UNREAD
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-theme-textMuted font-mono">
                  {new Date(msg.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-theme-textMuted">
                  Subject: <span className="text-theme-text font-sans normal-case font-semibold">{msg.subject}</span>
                </h4>
                <p className="text-xs sm:text-sm text-theme-text leading-relaxed whitespace-pre-wrap p-4 rounded-2xl bg-theme-surfaceSecondary border border-theme-border font-sans">
                  {msg.message}
                </p>
              </div>

              {/* Replies History */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-theme-border space-y-2">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-500">
                    Dispatched Replies ({msg.replies.length})
                  </p>
                  {msg.replies.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-indigo-500 font-semibold font-mono">
                        <span>Replied by: {r.repliedBy || 'Praveen Rai'}</span>
                        <span className="text-theme-textMuted">
                          {new Date(r.repliedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-theme-text whitespace-pre-wrap font-sans">
                        {r.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-theme-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiCornerDownRight}
                    onClick={() => openReplyModal(msg)}
                  >
                    Reply via Email
                  </Button>

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
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
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
        title={`Reply to ${selectedMessage?.name || 'Contact'}`}
      >
        <form onSubmit={handleSendReply} className="space-y-4">
          <div className="p-3 rounded-2xl bg-theme-surfaceSecondary border border-theme-border text-xs space-y-1">
            <p className="text-theme-text font-bold">
              Original Message ({selectedMessage?.subject}):
            </p>
            <p className="text-theme-textMuted italic line-clamp-3">
              "{selectedMessage?.message}"
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
              Email Response Body *
            </label>
            <textarea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              placeholder="Hi there, thank you for reaching out..."
              className="w-full px-4 py-3 rounded-2xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
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
              Send Email Response
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMessages;
