'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, GraduationCap, UserCircle, HeartHandshake, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { createSchool, getAllUsers } from '@/lib/store';
import type { Role } from '@/lib/types';

type RoleOption = {
  id: Role;
  label: string;
  icon: typeof Building2;
  description: string;
  gradient: string;
};

const ROLES: RoleOption[] = [
  { id: 'admin', label: 'School Admin', icon: Building2, description: 'Manage institution & teachers', gradient: 'from-violet-500 to-purple-600' },
  { id: 'teacher', label: 'Teacher', icon: GraduationCap, description: 'Manage classes & assignments', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'student', label: 'Student', icon: UserCircle, description: 'Join classes & submit work', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'parent', label: 'Parent', icon: HeartHandshake, description: "Monitor your child's progress", gradient: 'from-amber-500 to-orange-600' },
];

function LoginContent() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [childEmail, setChildEmail] = useState('');

  useEffect(() => {
    if (user) router.replace(searchParams.get('redirect') || '/');
  }, [user, router, searchParams]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setTimeout(() => setStep('credentials'), 300);
  };

  const handleBack = () => { setStep('role'); setSelectedRole(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !email.trim() || !name.trim()) return;
    login(email.trim(), name.trim(), selectedRole, childEmail.trim() || undefined);

    if (selectedRole === 'admin' && schoolName.trim()) {
      setTimeout(() => {
        const admin = getAllUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (admin) createSchool(schoolName.trim(), admin.id);
      }, 100);
    }
  };

  const selectedRoleData = ROLES.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
            >
              <span className="text-white font-bold text-xl">F</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to FlowClass</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your learning dashboard</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div
                key="role-selector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="space-y-3"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">
                  Choose your role
                </p>
                {ROLES.map((role, i) => (
                  <motion.button
                    key={role.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white transition-all text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow transition-shadow`}>
                      <role.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{role.label}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {step === 'credentials' && selectedRoleData && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
                  </motion.button>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedRoleData.gradient} flex items-center justify-center`}>
                    <selectedRoleData.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{selectedRoleData.label}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Chen" required autoFocus
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder-gray-400" />
                  </div>

                  {selectedRole === 'admin' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">School name</label>
                      <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g. Westside High School"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder-gray-400" />
                    </motion.div>
                  )}

                  {selectedRole === 'parent' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your child&apos;s email</label>
                      <input type="email" value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="child@example.com" required
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all placeholder-gray-400" />
                      <p className="text-xs text-gray-400 mt-1">The child must already have a FlowClass account.</p>
                    </motion.div>
                  )}

                  {selectedRole === 'teacher' && (
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                      Teachers are provisioned by your school admin. If you don&apos;t have access yet, ask your admin to add you.
                    </p>
                  )}

                  <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-2.5 bg-indigo-500 text-white text-sm font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Sign in as {selectedRoleData.label}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
