'use client';

import { motion } from 'framer-motion';
import { MoreHorizontal, Users } from 'lucide-react';

interface ClassBannerProps {
  name: string;
  section: string;
  teacher: string;
}

export default function ClassBanner({ name, section, teacher }: ClassBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative group"
    >
      {/* Banner card */}
      <motion.div
        whileHover={{ scale: 1.005, y: -1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative h-48 md:h-56 rounded-2xl overflow-hidden cursor-pointer shadow-sm"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />

        {/* Decorative orbs — subtle floating elements */}
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 25 }}
            className="text-2xl md:text-4xl font-bold text-white tracking-tight"
          >
            {name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
            className="text-white/80 mt-1 text-sm md:text-base"
          >
            {section}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
            className="text-white/60 text-xs md:text-sm mt-0.5"
          >
            {teacher}
          </motion.p>
        </div>

        {/* Top-right actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Class actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom-right class code */}
        <div className="absolute top-4 left-4 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>24 students</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
