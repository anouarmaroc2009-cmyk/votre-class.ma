'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Mail, Shield, User } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/lib/auth-context';
import { getClass, getClassRoster, findUserById } from '@/lib/store';

export default function PeoplePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [roster, setRoster] = useState<ReturnType<typeof getClassRoster>>([]);

  useEffect(() => {
    if (!isLoading && !user) { router.replace('/login'); return; }
  }, [user, isLoading, router]);

  useEffect(() => {
    setRoster(getClassRoster(id));
  }, [id]);

  if (isLoading || !user) return null;

  const cls = getClass(id);
  if (!cls) { router.replace('/'); return null; }

  const teachers = roster.filter((r) => r.role === 'teacher');
  const students = roster.filter((r) => r.role === 'student');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{cls.name}</h1>
            <p className="text-sm text-gray-500">{roster.length} people</p>
          </div>
        </div>

        {/* Teachers */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Teachers — {teachers.length}
          </h2>
          <div className="space-y-1">
            {teachers.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.email}</p>
                </div>
                <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Students */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Students — {students.length}
          </h2>
          <div className="space-y-1">
            {students.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No students enrolled yet.</p>
            ) : (
              students.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.email}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
