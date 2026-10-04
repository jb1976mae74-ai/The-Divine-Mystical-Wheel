/**
 * Google Picker API Integration Utility
 * Supports secure client-side file selection from Google Drive with iframe origin handling.
 */

export interface PickedGoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  url?: string;
  description?: string;
  sizeBytes?: number;
  lastEditedUtc?: number;
  content?: string;
}

/**
 * Loads the Google API client and the Picker library (gapi.load('picker')).
 */
export const loadGooglePickerApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window environment required for Google Picker.'));
    }

    const checkAndInitPicker = () => {
      const g = (window as any).google;
      if (g?.picker?.PickerBuilder) {
        return resolve();
      }

      const gapi = (window as any).gapi;
      if (gapi) {
        gapi.load('picker', {
          callback: () => {
            if ((window as any).google?.picker) {
              resolve();
            } else {
              reject(new Error('Google Picker library did not mount properly.'));
            }
          },
          onerror: (err: any) => {
            reject(new Error(`Failed to load Google Picker library: ${err?.message || 'unknown error'}`));
          },
        });
      } else {
        // Dynamically insert api.js script if not present
        const existingScript = document.getElementById('google-api-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'google-api-script';
          script.src = 'https://apis.google.com/js/api.js';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            const loadedGapi = (window as any).gapi;
            if (loadedGapi) {
              loadedGapi.load('picker', {
                callback: () => resolve(),
                onerror: () => reject(new Error('Failed to load Google Picker via gapi.load')),
              });
            } else {
              reject(new Error('Failed to access gapi after script load.'));
            }
          };
          script.onerror = () => reject(new Error('Failed to load Google API script (apis.google.com/js/api.js)'));
          document.head.appendChild(script);
        } else {
          setTimeout(checkAndInitPicker, 150);
        }
      }
    };

    checkAndInitPicker();
  });
};

export interface ShowPickerOptions {
  accessToken: string;
  title?: string;
  allowedMimeTypes?: string[];
  viewMode?: 'docs' | 'all' | 'folders';
  onPicked: (file: PickedGoogleDriveFile) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Triggers the interactive Google Picker dialog for selecting files from Google Drive.
 */
export const openGooglePicker = async ({
  accessToken,
  title = 'Select Sacred Scroll or Document from Google Drive',
  allowedMimeTypes,
  onPicked,
  onCancel,
  onError,
}: ShowPickerOptions): Promise<void> => {
  try {
    if (!accessToken) {
      throw new Error('Access token is required to open Google Picker. Please sign in with Google first.');
    }

    await loadGooglePickerApi();

    const google = (window as any).google;
    if (!google?.picker) {
      throw new Error('Google Picker API is not available.');
    }

    // Determine correct origin (handle iframe environments gracefully)
    const pickerOrigin =
      window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
        ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
        : window.location.origin;

    const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false);

    if (allowedMimeTypes && allowedMimeTypes.length > 0) {
      docsView.setMimeTypes(allowedMimeTypes.join(','));
    }

    const uploadView = new google.picker.DocsUploadView();

    const builder = new google.picker.PickerBuilder()
      .setTitle(title)
      .addView(docsView)
      .addView(uploadView)
      .setOAuthToken(accessToken)
      .setOrigin(pickerOrigin)
      .setCallback(async (data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const doc = data.docs && data.docs[0];
          if (!doc) return;

          let fetchedContent: string | undefined = undefined;

          // Attempt to retrieve content for text, markdown, or JSON files
          const isText =
            doc.mimeType?.includes('text') ||
            doc.mimeType?.includes('json') ||
            doc.mimeType?.includes('markdown') ||
            doc.name?.endsWith('.md') ||
            doc.name?.endsWith('.txt') ||
            doc.name?.endsWith('.json');

          if (isText && doc.id) {
            try {
              const res = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              if (res.ok) {
                fetchedContent = await res.text();
              }
            } catch (fetchErr) {
              console.warn('Could not auto-fetch picked file content:', fetchErr);
            }
          }

          onPicked({
            id: doc.id,
            name: doc.name,
            mimeType: doc.mimeType,
            url: doc.url,
            description: doc.description,
            sizeBytes: doc.sizeBytes,
            lastEditedUtc: doc.lastEditedUtc,
            content: fetchedContent,
          });
        } else if (data.action === google.picker.Action.CANCEL) {
          if (onCancel) onCancel();
        }
      });

    const picker = builder.build();
    picker.setVisible(true);
  } catch (err: any) {
    console.error('Error invoking Google Picker:', err);
    if (onError) {
      onError(err);
    } else {
      alert(`Google Picker Notice: ${err?.message || 'Could not display Google Picker dialog.'}`);
    }
  }
};
