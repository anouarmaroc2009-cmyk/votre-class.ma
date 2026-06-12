'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Paperclip, Heart, MessageCircle } from 'lucide-react';
import CommentSection from './CommentSection';
import type { Post } from '@/lib/types';

interface PostCardProps {
  post: Post;
  index: number;
  onAddComment: (postId: string, content: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors: Record<string, string> = {
  'Dr. Sarah Chen': 'from-indigo-400 to-purple-500',
  'Alex Rivera': 'from-emerald-400 to-teal-500',
  'Maya Johnson': 'from-amber-400 to-orange-500',
};

function getAvatarColor(name: string): string {
  return avatarColors[name] || 'from-gray-400 to-gray-500';
}

function formatTimestamp(dateStr: string): string {
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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getTypeBadge(type: string): { label: string; color: string } | null {
  switch (type) {
    case 'announcement':
      return { label: 'Announcement', color: 'bg-indigo-100 text-indigo-700' };
    case 'assignment':
      return { label: 'Assignment', color: 'bg-amber-100 text-amber-700' };
    case 'material':
      return { label: 'Material', color: 'bg-emerald-100 text-emerald-700' };
    default:
      return null;
  }
}

export default function PostCard({ post, index, onAddComment }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const badge = getTypeBadge(post.type);

  const handleAddComment = (content: string) => {
    onAddComment(post.id, content);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        delay: index * 0.04,
      }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(post.author.name)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
          >
            {getInitials(post.author.name)}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{post.author.name}</span>
              {post.pinned && (
                <Pin className="w-3 h-3 text-indigo-500" aria-label="Pinned post" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500">{formatTimestamp(post.createdAt)}</span>
              {badge && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.attachments.map((att, i) => (
            <motion.a
              key={i}
              href={att.url}
              whileHover={{ y: -1 }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors text-sm"
            >
              <Paperclip className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{att.name}</span>
            </motion.a>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
        >
          <motion.div
            animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          </motion.div>
          <span>{post.comments.length + (liked ? 1 : 0)}</span>
        </motion.button>

        <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        comments={post.comments}
        onAddComment={handleAddComment}
      />
    </motion.div>
  );
}
