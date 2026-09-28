import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSec = Math.floor((now - date) / 1000);

  if (diffInSec < 60) return 'Just now';
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    case 'reminder':
      return <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />;
    case 'info':
    default:
      return <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />;
  }
};

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail to avoid disrupting user experience
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Poll every 35 seconds for fresh notifications
    const interval = setInterval(fetchNotifications, 35000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Quiet fail
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      // Quiet fail
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => {
        const item = prev.find((n) => n._id === id);
        if (item && !item.read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (err) {
      // Quiet fail
    }
  };

  const handleItemClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 transition-all active:scale-95 shadow-2xs"
        aria-label="View notifications"
        title="Citizen Alerts & Updates"
      >
        <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 dark:text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[1.125rem] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-xs animate-pulse ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm bg-white dark:bg-[#111a2e] rounded-2xl shadow-elevation border border-slate-200 dark:border-[#1e2c45] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1e2c45] bg-slate-50/70 dark:bg-[#0c1322]/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gov-100 dark:bg-sky-950 text-gov-800 dark:text-sky-300 border border-gov-200 dark:border-sky-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={loading}
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-bold text-gov-700 dark:text-sky-400 hover:text-gov-900 dark:hover:text-sky-300 transition-colors"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List Body */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-[#1e2c45]/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No notifications yet
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  You will receive real-time alerts for scheme updates, readiness scores, and application tracking here.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.read;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 transition-colors cursor-pointer flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      isUnread
                        ? 'bg-sky-50/40 dark:bg-sky-950/20'
                        : 'bg-white dark:bg-[#111a2e]'
                    }`}
                  >
                    <div className="mt-0.5">{getTypeIcon(item.type)}</div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4
                          className={`text-xs leading-snug line-clamp-1 ${
                            isUnread
                              ? 'font-bold text-slate-900 dark:text-white'
                              : 'font-semibold text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        {item.link ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gov-700 dark:text-sky-400 hover:underline">
                            <span>Open details</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        ) : (
                          <span />
                        )}

                        <div className="flex items-center gap-1">
                          {isUnread && (
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsRead(item._id, e)}
                              className="p-1 rounded text-slate-400 hover:text-gov-700 dark:hover:text-sky-300 hover:bg-slate-200/50 dark:hover:bg-slate-700"
                              title="Mark as read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item._id, e)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#0c1322] border-t border-slate-100 dark:border-[#1e2c45] grid grid-cols-2 gap-2 text-center">
            <Link
              to="/applications"
              onClick={() => setIsOpen(false)}
              className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-gov-700 dark:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              My Applications →
            </Link>
            <Link
              to="/documents"
              onClick={() => setIsOpen(false)}
              className="px-2 py-1.5 rounded-lg text-[11px] font-bold text-gov-700 dark:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              Document Vault →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
