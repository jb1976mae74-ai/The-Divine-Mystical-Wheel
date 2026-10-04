import { useEffect } from 'react';

/**
 * Global Keyboard Shortcut Manager
 */
export const useKeyboardShortcuts = (
  setDrawerOpen: (open: boolean) => void,
  selectTab: (tab: string) => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl key
      if (event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'h': // Ctrl + H: Open Consultation History Drawer
            event.preventDefault();
            setDrawerOpen(true);
            break;
          case 'o': // Ctrl + O: Navigate to Oracle Tab
            event.preventDefault();
            selectTab('oracle');
            break;
          case 'i': // Ctrl + I: Navigate to Enochian Tab (for example)
            event.preventDefault();
            selectTab('enochian');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDrawerOpen, selectTab]);
};
