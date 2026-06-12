'use client';

import { useState } from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import ClassBanner from '@/components/ClassBanner';
import UpcomingWidget from '@/components/UpcomingWidget';
import StreamFeed from '@/components/StreamFeed';
import NewPostForm from '@/components/NewPostForm';

const MOCK_TEACHER = { id: 't1', name: 'Dr. Sarah Chen', image: '' };
const MOCK_STUDENT = { id: 's1', name: 'Alex Rivera', image: '' };

const INITIAL_POSTS = [
  {
    id: 'p1',
    content: 'Welcome to Advanced Mathematics II! Please review the syllabus before our first class on Monday. I\'m looking forward to a great semester exploring calculus, linear algebra, and differential equations.',
    type: 'announcement' as const,
    pinned: true,
    author: MOCK_TEACHER,
    comments: [
      { id: 'c1', content: 'Looking forward to it!', author: MOCK_STUDENT, createdAt: '2026-06-12T10:30:00Z' },
      { id: 'c2', content: 'Will the textbook be available online?', author: { id: 's2', name: 'Maya Johnson', image: '' }, createdAt: '2026-06-12T11:00:00Z' },
    ],
    createdAt: '2026-06-12T09:00:00Z',
  },
  {
    id: 'p2',
    content: 'Homework 1 is now posted. Covers chapters 1-3. Due Friday at 11:59 PM.',
    type: 'assignment' as const,
    pinned: false,
    author: MOCK_TEACHER,
    comments: [],
    createdAt: '2026-06-11T14:00:00Z',
  },
  {
    id: 'p3',
    content: 'Great discussion today on limits! Here are the notes from class.',
    type: 'material' as const,
    pinned: false,
    author: MOCK_TEACHER,
    attachments: [{ name: 'limits-notes.pdf', url: '#', type: 'application/pdf' }],
    comments: [
      { id: 'c3', content: 'Thanks Dr. Chen!', author: MOCK_STUDENT, createdAt: '2026-06-10T15:30:00Z' },
    ],
    createdAt: '2026-06-10T14:00:00Z',
  },
];

const UPCOMING_WORK = [
  { id: 'a1', title: 'Homework 1: Limits & Continuity', courseName: 'Advanced Mathematics II', dueDate: '2026-06-16T23:59:00Z', points: 100 },
  { id: 'a2', title: 'Reading Response: Chapter 4', courseName: 'Advanced Mathematics II', dueDate: '2026-06-18T23:59:00Z', points: 50 },
  { id: 'a3', title: 'Quiz 1 Preparation', courseName: 'Advanced Mathematics II', dueDate: '2026-06-20T23:59:00Z', points: 25 },
];

export default function StreamPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const handleNewPost = (content: string) => {
    const newPost = {
      id: `p${Date.now()}`,
      content,
      type: 'announcement' as const,
      pinned: false,
      author: MOCK_TEACHER,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <ClassBanner
          name="Advanced Mathematics II"
          section="Section A · Room 204"
          teacher="Dr. Sarah Chen"
        />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-6">
            <NewPostForm onSubmit={handleNewPost} />
            <StreamFeed posts={posts} />
          </div>

          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <UpcomingWidget items={UPCOMING_WORK} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
