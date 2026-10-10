const REQUIRED_SERVER_ENV = ['GEMINI_API_KEY'];
const OPTIONAL_ENV = ['APP_URL', 'GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_LOCATION', 'VITE_GOOGLE_MAPS_API_KEY'];

const placeholderValues = new Set(['MY_GEMINI_API_KEY', 'MY_APP_URL', 'GOOGLE_CLOUD_PROJECT_ID', '']);

export function validateRuntimeConfig(options: { throwOnMissing?: boolean } = {}) {
  const throwOnMissing = options.throwOnMissing ?? (typeof window === 'undefined');
  const env = typeof process !== 'undefined' ? process.env : {};

  const missing = REQUIRED_SERVER_ENV.filter((key) => {
    const value = env[key];
    return !value || placeholderValues.has(value);
  });

  const optionalMissing = OPTIONAL_ENV.filter((key) => {
    const value = env[key];
    return !value || placeholderValues.has(value);
  });

  if (missing.length > 0) {
    const message = `[Runtime config] Missing required environment values: ${missing.join(', ')}`;
    if (throwOnMissing) {
      throw new Error(message);
    }
    console.warn(message);
  }

  if (optionalMissing.length > 0) {
    console.warn(`[Runtime config] Optional environment values are unset or still placeholders: ${optionalMissing.join(', ')}`);
  }

  return { missing, optionalMissing };
}
