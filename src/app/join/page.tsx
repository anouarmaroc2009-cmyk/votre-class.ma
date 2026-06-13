'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { joinClass, getClassByCode } from '@/lib/store';
import Link from 'next/link';

function JoinContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace(`/login?redirect=/join?${searchParams.toString()}`); return; }

    const code = searchParams.get('code');
    if (!code) { setStatus('error'); return; }

    const cls = getClassByCode(code);
    if (!cls) { setStatus('error'); return; }

    setClassName(cls.name);
    const result = joinClass(code, user.id);
    if (result) {
      setStatus('success');
      setTimeout(() => router.push(`/class/${result.id}`), 2000);
    } else {
      setStatus('error');
    }
  }, [isLoading, user, router, searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-sm w-full text-center"
    >
      {status === 'loading' && (
        <div className="py-8">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Joining class...</p>
        </div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Joined successfully!</h2>
          <p className="text-sm text-gray-500 mt-1">You are now enrolled in <strong>{className}</strong></p>
          <p className="text-xs text-gray-400 mt-4">Redirecting you to the class...</p>
        </motion.div>
      )}

      {status === 'error' && (
        <div>
          <XCircle className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Invalid invite link</h2>
          <p className="text-sm text-gray-500 mt-1">This class code doesn&apos;t exist or has expired.</p>
          <Link href="/" className="inline-block mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700">Back to dashboard</Link>
        </div>
      )}
    </motion.div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="py-8">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        </div>
      }>
        <JoinContent />
      </Suspense>
    </div>
  );
}
