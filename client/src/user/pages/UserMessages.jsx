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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Messages & Conversations
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Direct communication channel with Praveen Rai. View responses and discussion history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Send Message Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSend}
            className="p-6 rounded-3xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FiMail className="text-brand-500" />
              Send a New Message
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Question about project architecture / referral"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Message Content *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Write your detailed query or message here..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
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
              Send Direct Message
            </Button>
          </form>
        </div>

        {/* Message Thread List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Conversation History
          </h3>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : messages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs text-gray-500">
              No messages sent yet. Use the form to reach out directly to Praveen!
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-5 rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {msg.subject || 'Direct Message'}
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* User's Original Message */}
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-dark-surface text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      You wrote:
                    </p>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {/* Admin Replies */}
                  {msg.replies && msg.replies.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {msg.replies.map((reply, rIdx) => (
                        <div
                          key={rIdx}
                          className="pl-4 border-l-2 border-brand-500 flex items-start gap-3 bg-brand-50/50 dark:bg-brand-950/20 p-3.5 rounded-r-xl"
                        >
                          <FiCornerDownRight className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                                {reply.repliedBy || 'Praveen Rai'}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(reply.repliedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                              {reply.replyText}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-400 italic pt-1">
                      <FiMessageCircle className="w-3.5 h-3.5" />
                      Awaiting Praveen's reply...
                    </div>
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
