'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface UpcomingItem {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  points: number;
}

interface UpcomingWidgetProps {
  items: UpcomingItem[];
}

function DueDateBadge({ dueDate }: { dueDate: string }) {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) { setLabel('Overdue'); setColor('text-red-600 bg-red-50'); }
    else if (diffDays === 0) { setLabel('Today'); setColor('text-amber-600 bg-amber-50'); }
    else if (diffDays === 1) { setLabel('Tomorrow'); setColor('text-amber-600 bg-amber-50'); }
    else if (diffDays <= 7) { setLabel(`In ${diffDays} days`); setColor('text-gray-500 bg-gray-50'); }
    else { setLabel(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })); setColor('text-gray-500 bg-gray-50'); }
  }, [dueDate]);

  return (
    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${color}`}>
      <Clock className="w-3 h-3 inline mr-0.5 -mt-0.5" />
      {label}
    </span>
  );
}

export default function UpcomingWidget({ items }: UpcomingWidgetProps) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sorted = [...items].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-900">Upcoming Work</h3>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            {items.length - completedIds.size}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="widget-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-1">
              <AnimatePresence mode="popLayout">
                {sorted.map((item, i) => {
                  const isDone = completedIds.has(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                        delay: i * 0.03,
                      }}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${
                        isDone ? 'bg-gray-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleComplete(item.id)}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <motion.div
                          animate={isDone ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-indigo-500 border-indigo-500'
                              : 'border-gray-300 group-hover:border-indigo-300'
                          }`}
                        >
                          {isDone && (
                            <motion.svg
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3 }}
                              className="w-3 h-3 text-white"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <motion.path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              />
                            </motion.svg>
                          )}
                        </motion.div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate transition-colors ${
                            isDone ? 'text-gray-400 line-through' : 'text-gray-900'
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${isDone ? 'text-gray-300' : 'text-gray-500'}`}>
                          {item.courseName}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <DueDateBadge dueDate={item.dueDate} />
                          <span className="text-[11px] text-gray-400 font-medium">
                            {item.points} pts
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {sorted.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No upcoming work — you&apos;re all caught up!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
