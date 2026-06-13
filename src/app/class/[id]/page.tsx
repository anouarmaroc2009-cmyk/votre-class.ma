'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavigationHeader from '@/components/NavigationHeader';
import ClassBanner from '@/components/ClassBanner';
import StreamFeed from '@/components/StreamFeed';
import NewPostForm from '@/components/NewPostForm';
import UpcomingWidget from '@/components/UpcomingWidget';
import { useAuth } from '@/lib/auth-context';
import { getClass, getClassPosts, createPost, addComment, listUserClasses, findUserById } from '@/lib/store';
import type { Post as PostType } from '@/lib/types';

export default function ClassPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cls, setCls] = useState(getClass(id));
  const [posts, setPosts] = useState<PostType[]>([]);
  const [myRole, setMyRole] = useState<string>('student');

  useEffect(() => {
    if (!isLoading && !user) { router.replace('/login'); return; }
    if (user) {
      const classes = listUserClasses(user.id);
      const found = classes.find((c) => c.id === id);
      if (!found) { router.replace('/'); return; }
      setMyRole(found.myRole);
    }
  }, [user, isLoading, id, router]);

  useEffect(() => {
    setCls(getClass(id));
    setPosts(getClassPosts(id));
  }, [id]);

  const handleNewPost = (content: string) => {
    if (!user) return;
    const post = createPost(content, user.id, id);
    setPosts(getClassPosts(id));
  };

  const handleAddComment = useCallback((postId: string, content: string) => {
    if (!user) return;
    addComment(postId, content, user.id);
    setPosts(getClassPosts(id));
  }, [user, id]);

  if (isLoading || !user || !cls) return null;

  const teacher = findUserById(cls.teacherId);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <ClassBanner
          name={cls.name}
          section={cls.section || 'No section'}
          teacher={teacher?.name || 'Unknown'}
          coverColor={cls.coverColor}
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-6">
            {myRole === 'teacher' && <NewPostForm onSubmit={handleNewPost} />}
            <StreamFeed
              posts={posts}
              onAddComment={handleAddComment}
            />
          </div>

          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <UpcomingWidget items={[]} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
