'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Filter, ChevronRight, AlertCircle } from 'lucide-react';

interface NotificationModalProps {
  show: boolean;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  onClose: () => void;
}

export default function NotificationModal({ show, message, type, title, onClose }: NotificationModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`soothing-bottom-modal type-${type}`}
        >
          <div className="modal-content-soothing">
            <div className="modal-icon-wrapper">
              <div className="pulse-ring"></div>
              {type === 'success' && <CheckCircle2 size={24} className="text-emerald" />}
              {type === 'info' && <Sparkles size={24} style={{ color: '#6366f1' }} />}
              {type === 'error' && <AlertCircle size={24} style={{ color: '#ef4444' }} />}
              {type === 'warning' && <Filter size={24} style={{ color: '#f59e0b' }} />}
            </div>
            <div className="modal-text">
              <h4>{title}</h4>
              <p>{message}</p>
            </div>
            <button 
              className="modal-close-btn"
              onClick={onClose}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
