/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

export function useKeyboardShortcut(targetKey: string, callback: KeyHandler, ctrlKeyRequired = false): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const matchesKey = event.key.toLowerCase() === targetKey.toLowerCase();
      const matchesCtrl = ctrlKeyRequired ? (event.ctrlKey || event.metaKey) : true;

      if (matchesKey && matchesCtrl) {
        callback(event);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, callback, ctrlKeyRequired]);
}
