'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogIn, X, Copy, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { listUserClasses, createClass, joinClass, findUserById } from '@/lib/store';
import ClassCard from '@/components/ClassCard';
import NavigationHeader from '@/components/NavigationHeader';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<ReturnType<typeof listUserClasses>>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSection, setNewSection] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => { setOrigin(window.location.origin); }, []);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) setClasses(listUserClasses(user.id));
  }, [user]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !user) return;
    const cls = createClass(newName.trim(), newSection.trim(), user.id);
    setClasses(listUserClasses(user.id));
    setShowCreate(false);
    setNewName('');
    setNewSection('');
    setCopiedCode(cls.code);
    setTimeout(() => setCopiedCode(''), 4000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !user) return;
    const result = joinClass(joinCode.trim().toUpperCase(), user.id);
    if (result) {
      setClasses(listUserClasses(user.id));
      setShowJoin(false);
      setJoinCode('');
      setJoinError('');
    } else {
      setJoinError('Invalid code. Please check and try again.');
    }
  };

  if (isLoading || !user) return null;

  const isTeacher = user.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isTeacher ? 'Manage your courses' : 'Your enrolled courses'}
            </p>
          </div>
          <div className="flex gap-2">
            {isTeacher && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create class
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Join
            </motion.button>
          </div>
        </div>

        {copiedCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              Class created! Share code: <strong>{copiedCode}</strong> — link: <code className="bg-emerald-100 px-1 rounded">{origin}/join?code={copiedCode}</code>
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(`${origin}/join?code=${copiedCode}`); setCopiedCode(''); }}
              className="ml-auto p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {classes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">No classes yet</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isTeacher ? 'Create your first class to get started.' : 'Ask your teacher for the class code to join.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {classes.map((c, i) => (
              <ClassCard key={c.id} {...c} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Create a class</h2>
                <button onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class name *</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Advanced Mathematics II"
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="e.g. Section A"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <motion.button type="submit" whileTap={{ scale: 0.98 }} className="flex-[2] py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm">Create</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Class Modal */}
      <AnimatePresence>
        {showJoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowJoin(false); setJoinError(''); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Join a class</h2>
                <button onClick={() => { setShowJoin(false); setJoinError(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class code</label>
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC12"
                    required
                    autoFocus
                    maxLength={7}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all uppercase tracking-widest"
                  />
                  {joinError && <p className="text-xs text-red-500 mt-1.5">{joinError}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => { setShowJoin(false); setJoinError(''); }} className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <motion.button type="submit" whileTap={{ scale: 0.98 }} className="flex-[2] py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm">Join</motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
