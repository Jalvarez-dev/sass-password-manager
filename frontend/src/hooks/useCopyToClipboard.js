/**
 * useCopyToClipboard - Copiar texto al portapapeles
 * @returns {Object} - { copied, copy, error }
 */

import { useState, useCallback } from 'react';

export const useCopyToClipboard = (resetInterval = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    if (!text) return false;

    try {
      // Intentar usar Clipboard API moderna
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores antiguos o contexto no seguro
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error('Fallback copy failed');
        }
      }

      setCopied(true);
      setError(null);

      // Resetear estado después del intervalo
      setTimeout(() => {
        setCopied(false);
      }, resetInterval);

      return true;
    } catch (err) {
      setError(err.message);
      setCopied(false);
      console.error('Copy failed:', err);
      return false;
    }
  }, [resetInterval]);

  return {
    copied,
    copy,
    error,
  };
};

export default useCopyToClipboard;