"use client";

import type { AuthResponse } from "@/types/auth";

const TOKEN_KEY = "ryven_access_token";
const USER_KEY = "ryven_user";

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const authStorage = {
  saveAuth(payload: AuthResponse) {
    if (!hasStorage()) {
      return;
    }
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },

  getToken() {
    if (!hasStorage()) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    if (!hasStorage()) {
      return null;
    }
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthResponse["user"];
    } catch {
      return null;
    }
  },

  clear() {
    if (!hasStorage()) {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
