/*
 * Optional Supabase client — lazy singleton.
 *
 * The app is local-first and works with NO Supabase configured. This module
 * never throws at import time and every export guards against a null client.
 * Config comes from Vite env vars (build-time) or localStorage (runtime, set
 * from the Settings page), env taking precedence.
 */
import { createClient } from '@supabase/supabase-js';

const URL_KEY = 'ddempire_sb_url';
const ANON_KEY = 'ddempire_sb_key';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const ls = (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } };

export function getConfig() {
  return {
    url: envUrl || ls(URL_KEY),
    key: envKey || ls(ANON_KEY)
  };
}

export function setConfig(url, key) {
  try {
    localStorage.setItem(URL_KEY, (url || '').trim());
    localStorage.setItem(ANON_KEY, (key || '').trim());
  } catch { /* ignore */ }
  _client = null; // force re-create with new config
}

export function isConfigured() {
  const { url, key } = getConfig();
  return !!url && !!key;
}

let _client = null;
let _clientSig = '';

/** Returns the shared Supabase client, or null when unconfigured. */
export function getClient() {
  if (!isConfigured()) { _client = null; return null; }
  const { url, key } = getConfig();
  const sig = url + '|' + key;
  if (_client && _clientSig === sig) return _client;
  try {
    _client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    _clientSig = sig;
    return _client;
  } catch {
    _client = null;
    return null;
  }
}

/* ---- Auth helpers (all null-safe) ---- */

/** Email magic-link / OTP sign-in. Returns { error } shape. */
export async function signInWithEmail(email) {
  const sb = getClient();
  if (!sb) return { data: null, error: new Error('Supabase not configured') };
  try {
    return await sb.auth.signInWithOtp({ email });
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOut() {
  const sb = getClient();
  if (!sb) return { error: null };
  try {
    return await sb.auth.signOut();
  } catch (error) {
    return { error };
  }
}

/** Current signed-in user, or null. */
export async function getUser() {
  const sb = getClient();
  if (!sb) return null;
  try {
    const { data } = await sb.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}

/**
 * Subscribe to auth state changes. `cb` receives the user (or null).
 * Returns an unsubscribe function (no-op when unconfigured).
 */
export function onAuth(cb) {
  const sb = getClient();
  if (!sb) return () => {};
  try {
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      cb(session?.user || null);
    });
    return () => { try { data?.subscription?.unsubscribe(); } catch { /* ignore */ } };
  } catch {
    return () => {};
  }
}
