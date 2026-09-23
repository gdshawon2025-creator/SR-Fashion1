// Helper for Admin Password Authentication and Session Management

const ADMIN_PASS_KEY = 'sr_fashion_admin_pass';
const ADMIN_AUTH_SESSION_KEY = 'sr_fashion_admin_session';
const ADMIN_AUTH_REMEMBER_KEY = 'sr_fashion_admin_remember';

export const DEFAULT_ADMIN_PASSWORD = 'admin123';

export const getStoredPassword = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PASS_KEY);
    return saved && saved.trim() !== '' ? saved : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const setStoredPassword = (newPassword: string): boolean => {
  try {
    if (!newPassword || newPassword.trim().length < 4) {
      return false;
    }
    localStorage.setItem(ADMIN_PASS_KEY, newPassword.trim());
    return true;
  } catch {
    return false;
  }
};

export const resetStoredPassword = (): void => {
  try {
    localStorage.removeItem(ADMIN_PASS_KEY);
  } catch {
    // ignore
  }
};

export const verifyPassword = (input: string): boolean => {
  const current = getStoredPassword();
  return input.trim() === current;
};

export const isAdminLoggedIn = (): boolean => {
  try {
    const sessionAuth = sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY);
    const rememberAuth = localStorage.getItem(ADMIN_AUTH_REMEMBER_KEY);
    return sessionAuth === 'true' || rememberAuth === 'true';
  } catch {
    return false;
  }
};

export const setAdminLoggedIn = (remember = false): void => {
  try {
    sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'true');
    if (remember) {
      localStorage.setItem(ADMIN_AUTH_REMEMBER_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_AUTH_REMEMBER_KEY);
    }
  } catch {
    // ignore
  }
};

export const adminLogout = (): void => {
  try {
    sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
    localStorage.removeItem(ADMIN_AUTH_REMEMBER_KEY);
  } catch {
    // ignore
  }
};
