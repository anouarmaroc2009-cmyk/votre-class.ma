'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, BookOpen } from 'lucide-react';
import { getTodayTimetable, findUserById, getClass } from '@/lib/store';

interface TimetableWidgetProps {
  userId: string;
}

const DAY_NAMES: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
};

export default function TimetableWidget({ userId }: TimetableWidgetProps) {
  const [slots, setSlots] = useState<ReturnType<typeof getTodayTimetable>>([]);
  const [now, setNow] = useState('');

  useEffect(() => {
    setSlots(getTodayTimetable(userId));
    setNow(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  }, [userId]);

  const todayName = DAY_NAMES[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()] || '';
  const isToday = (start: string, end: string) => now >= start && now <= end;

  if (slots.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Schedule</h3>
          <span className="text-xs text-gray-400 ml-auto">{todayName}</span>
        </div>
      </div>

      <div className="p-3 space-y-1">
        {slots.map((slot, i) => {
          const active = isToday(slot.startTime, slot.endTime);
          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex items-start gap-3 p-3 rounded-xl transition-all ${
                active ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-gray-50'
              }`}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="active-period"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}

              {/* Time column */}
              <div className="text-center flex-shrink-0 w-14 pt-0.5">
                <p className={`text-xs font-semibold ${active ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {slot.startTime}
                </p>
                <p className="text-[10px] text-gray-400">{slot.endTime}</p>
              </div>

              {/* Divider */}
              <div className={`w-px h-10 self-center ${active ? 'bg-indigo-200' : 'bg-gray-100'}`} />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${active ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {slot.subjectName || 'Unknown'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <BookOpen className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 truncate">{slot.className}</span>
                </div>
                {slot.room && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{slot.room}</span>
                  </div>
                )}
              </div>

              {/* Active badge */}
              {active && (
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">
                  Now
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
