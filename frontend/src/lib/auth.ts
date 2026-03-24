"use client";

import type { AuthResponse } from "@/types/auth";

const TOKEN_KEY = "ryven_access_token";
const USER_KEY = "ryven_user";

export const authStorage = {
  saveAuth(payload: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
