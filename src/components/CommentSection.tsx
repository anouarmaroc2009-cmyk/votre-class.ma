'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import type { Comment } from '@/lib/types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  'from-indigo-400 to-purple-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmit = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    onAddComment(trimmed);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="mt-4">
      {/* Toggle button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <motion.span
          animate={{ rotate: showComments ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-block"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
        {comments.length === 0
          ? 'Comment'
          : `${comments.length} ${comments.length === 1 ? 'comment' : 'comments'}`}
      </button>

      {/* Expandable comment section */}
      <AnimatePresence initial={false}>
        {showComments && (
          <motion.div
            key="comment-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-gray-100 space-y-3">
              {/* Comments list */}
              <AnimatePresence mode="popLayout">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, x: -12, y: -8 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="flex gap-2.5"
                  >
                    <div
                      className={`w-7 h-7 mt-0.5 rounded-full bg-gradient-to-br ${getAvatarColor(comment.author.name)} flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0`}
                    >
                      {getInitials(comment.author.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-gray-900">
                            {comment.author.name}
                          </span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Comment input */}
              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                  Y
                </div>
                <div className="flex-1 flex items-end gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm bg-gray-50 border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all placeholder-gray-400"
                  />
                  <motion.button
                    whileHover={newComment.trim() ? { scale: 1.05 } : {}}
                    whileTap={newComment.trim() ? { scale: 0.95 } : {}}
                    onClick={handleSubmit}
                    disabled={!newComment.trim()}
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                      newComment.trim()
                        ? 'text-indigo-500 hover:bg-indigo-50'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                    aria-label="Send comment"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
