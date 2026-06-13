'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Plus, X, Link, Copy, Check } from 'lucide-react';
import NavigationHeader from '@/components/NavigationHeader';
import { useAuth } from '@/lib/auth-context';
import { getClass, getClassRoster, listUserClasses } from '@/lib/store';
import { addStudentToClass } from '@/lib/store';
import type { User } from '@/lib/types';

export default function PeoplePage() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [roster, setRoster] = useState<(User & { role: string })[]>([]);
  const [myRole, setMyRole] = useState<string>('');
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) { router.replace('/login'); return; }
    if (user) {
      const classes = listUserClasses(user.id);
      const found = classes.find((c) => c.id === id);
      if (!found) { router.replace('/'); return; }
      setMyRole(found.myRole);
    }
  }, [user, isLoading, id, router]);

  useEffect(() => { setRoster(getClassRoster(id)); }, [id]);

  const cls = getClass(id);
  const isTeacher = myRole === 'teacher';

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!addEmail.trim()) return;
    const result = addStudentToClass(addEmail.trim(), id);
    if (result.success) {
      setAddSuccess(`Student added!`);
      setAddEmail('');
      setRoster(getClassRoster(id));
    } else {
      setAddError(result.error || 'Failed to add student.');
    }
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    const link = `${origin}/join?code=${cls?.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || !user || !cls) return null;

  const teachers = roster.filter((r) => r.role === 'teacher');
  const students = roster.filter((r) => r.role === 'student');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{cls.name}</h1>
              <p className="text-sm text-gray-500">{roster.length} people</p>
            </div>
          </div>
          {isTeacher && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add student
            </motion.button>
          )}
        </div>

        {/* Invite link — visible to teachers */}
        {isTeacher && (
          <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <Link className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">
                  Invite link: <code className="bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700 text-xs font-mono">
                    {typeof window !== 'undefined' ? `${window.location.origin}/join?code=${cls.code}` : ''}
                  </code>
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-50 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy link'}
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-2 ml-6">
              Code: <strong className="text-indigo-600">{cls.code}</strong> — Share this link or code with students to join
            </p>
          </div>
        )}

        {/* Teachers */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Teachers — {teachers.length}
          </h2>
          <div className="space-y-1">
            {teachers.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Students — {students.length}
            </h2>
          </div>
          <div className="space-y-1">
            {students.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No students enrolled yet.</p>
            ) : (
              students.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
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

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAdd(false); setAddError(''); setAddSuccess(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add student</h2>
                <button onClick={() => { setShowAdd(false); setAddError(''); setAddSuccess(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addSuccess ? (
                <div className="text-center py-6">
                  <Check className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900">Student added successfully!</p>
                  <button onClick={() => { setShowAdd(false); setAddSuccess(''); }} className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Student email</label>
                    <input
                      type="email"
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      autoFocus
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    />
                    {addError && <p className="text-xs text-red-500 mt-1.5">{addError}</p>}
                    <p className="text-xs text-gray-400 mt-1.5">The student must have signed in at least once to appear in the system.</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => { setShowAdd(false); setAddError(''); }} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                    <motion.button type="submit" whileTap={{ scale: 0.98 }} className="flex-[2] py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm">Add</motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
