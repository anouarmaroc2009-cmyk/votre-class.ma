'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import type { Post } from '@/lib/types';

interface StreamFeedProps {
  posts: Post[];
}

export default function StreamFeed({ posts }: StreamFeedProps) {
  const [localPosts, setLocalPosts] = useState(posts);

  const handleAddComment = useCallback((postId: string, content: string) => {
    setLocalPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `c${Date.now()}`,
              content,
              author: { id: 'me', name: 'You', image: '' },
              createdAt: new Date().toISOString(),
            },
          ],
        };
      })
    );
  }, []);

  // Group pinned posts first, then sort by date
  const sorted = [...localPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sorted.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            onAddComment={handleAddComment}
          />
        ))}
      </AnimatePresence>

      {sorted.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Be the first to post an announcement!
          </p>
        </motion.div>
      )}
    </div>
  );
}
