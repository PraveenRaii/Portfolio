import React, { useState, useEffect } from 'react';
import { FiSend, FiMail, FiMessageCircle, FiCornerDownRight } from 'react-icons/fi';
import { userService } from '../../services/userService';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await userService.getMyMessages();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err) {
      toast.error('Failed to load message history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      const res = await userService.sendMessage(formData);
      if (res.success) {
        toast.success(res.message);
        setFormData({ subject: '', message: '' });
        fetchMessages();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-card">
        <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs uppercase tracking-widestTechnical font-semibold mb-1">
          <FiMail className="w-3.5 h-3.5" />
          DIRECT MESSAGING
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-theme-text">
          Messages &amp; Conversations
        </h1>
        <p className="text-xs sm:text-sm text-theme-textMuted mt-0.5">
          Direct communication channel with Praveen Rai. View responses and discussion history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Send Message Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSend}
            className="p-6 sm:p-7 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-4"
          >
            <h3 className="text-base font-heading font-bold text-theme-text flex items-center gap-2">
              <FiMail className="text-indigo-500" />
              Send a New Message
            </h3>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Question about project architecture / collaboration"
                className="w-full px-4 py-2.5 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-theme-text mb-1.5">
                Message Content *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Write your note, feedback, or inquiry here..."
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-surfaceSecondary text-theme-text text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={FiSend}
              isLoading={sending}
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Message Logs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-heading font-bold text-theme-text flex items-center gap-2">
            <FiMessageCircle className="text-cyan-500" />
            Conversation History ({messages.length})
          </h3>

          {loading ? (
            <LoadingSkeleton count={3} />
          ) : messages.length === 0 ? (
            <div className="p-16 text-center rounded-3xl border border-dashed border-theme-border bg-theme-surface text-xs font-mono text-theme-textMuted shadow-card">
              No message history found. Submit the form on the left to start a conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-5 sm:p-6 rounded-3xl border border-theme-border bg-theme-surface shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-theme-border pb-3">
                    <span className="font-heading font-bold text-sm text-theme-text">
                      {msg.subject || 'Direct Inquiry'}
                    </span>
                    <span className="text-[11px] font-mono text-theme-textMuted">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-theme-text leading-relaxed whitespace-pre-wrap p-4 rounded-2xl bg-theme-surfaceSecondary border border-theme-border font-sans">
                    {msg.message}
                  </p>

                  {/* Replies List */}
                  {msg.replies && msg.replies.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-theme-border">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500">
                        Praveen's Response ({msg.replies.length})
                      </p>
                      {msg.replies.map((reply, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-indigo-500 font-bold">
                            <span className="flex items-center gap-1.5">
                              <FiCornerDownRight className="w-3.5 h-3.5" />
                              {reply.repliedBy || 'Praveen Rai'}
                            </span>
                            <span className="text-theme-textMuted font-normal">
                              {new Date(reply.repliedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-theme-text pl-5 whitespace-pre-wrap font-sans">
                            {reply.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-mono text-amber-500 italic">
                      Waiting for reply from Praveen...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
