// apps/web/src/components/auth/SecretAdminListener.tsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const SecretAdminListener: React.FC = () => {
  const { setIsSecretAdminModalOpen } = useAuth();
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const TARGET = 'admin';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, select, or contenteditable element
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toUpperCase();
        const isEditable = (activeEl as HTMLElement).isContentEditable;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || isEditable) {
          bufferRef.current = '';
          return;
        }
      }

      // Ignore modifier keys (Shift, Ctrl, Alt, Meta, CapsLock, Tab, etc.)
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const char = e.key.toLowerCase();

      // Clear timer on keypress
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Append char
      bufferRef.current += char;

      // Check if buffer starts matching "admin"
      if (!TARGET.startsWith(bufferRef.current)) {
        // If char matches 'a', start over with 'a', else clear
        bufferRef.current = char === 'a' ? 'a' : '';
      }

      // If full "admin" sequence typed
      if (bufferRef.current === TARGET) {
        bufferRef.current = '';
        setIsSecretAdminModalOpen(true);
      }

      // Auto reset after 2.5s inactivity
      timeoutRef.current = setTimeout(() => {
        bufferRef.current = '';
      }, 2500);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [setIsSecretAdminModalOpen]);

  return null;
};

export default SecretAdminListener;
