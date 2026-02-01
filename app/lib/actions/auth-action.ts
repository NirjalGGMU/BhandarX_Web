"use server";

import { login, register } from "../api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

export const handleRegister = async (data: RegisterData) => {
  try {
    const response = await register(data);
    console.log("📝 Register response:", response);
    if (response.success) {
      return { success: true, message: 'Registration successful', data: response.user };
    }
    return { success: false, message: response.message || 'Registration failed' };
  } catch (error: Error | any) {
    console.error("❌ Register error:", error);
    return { success: false, message: error.message || 'Registration action failed' };
  }
};

export const handleLogin = async (data: LoginData) => {
  try {
    console.log("🔑 Calling login API...");
    const response = await login(data);
    console.log("📦 API response:", response);
    if (response.success && response.token && response.user) {
      console.log("💾 Setting cookies...");
      await setAuthToken(response.token);
      await setUserData(response.user);
      console.log("✅ Cookies set successfully");
      return { success: true, message: 'Login successful', data: response.user };
    }
    console.log("⚠️ Login response missing token or user");
    return { success: false, message: response.message || 'Login failed' };
  } catch (error: Error | any) {
    console.error("🔴 Login action error:", error);
    return { success: false, message: error.message || 'Login action failed' };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  redirect('/login');
};