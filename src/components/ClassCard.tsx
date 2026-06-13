'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import Link from 'next/link';

interface ClassCardProps {
  id: string;
  name: string;
  section: string;
  teacher?: { name: string } | null;
  studentCount: number;
  coverColor: string;
  myRole: string;
  index: number;
}

export default function ClassCard({
  id, name, section, teacher, studentCount, coverColor, myRole, index,
}: ClassCardProps) {
  return (
    <Link href={`/class/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
        className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer shadow-sm transition-shadow"
      >
        <div className="h-24 relative" style={{ backgroundColor: coverColor }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-white font-bold text-lg leading-tight">{name}</h2>
            <p className="text-white/80 text-xs mt-0.5">{section}</p>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">{teacher?.name || 'You'}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>{studentCount}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
