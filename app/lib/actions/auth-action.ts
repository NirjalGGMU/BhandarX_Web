// // app/lib/actions/auth-action.ts


// app/lib/actions/auth-action.ts

"use server";

import { login, register, whoAmI, updateProfile } from "../api/auth";
import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

// Function to handle user registration
export const handleRegister = async (data: RegisterData) => {
  try {
    const response = await register(data);
    console.log("📝 Register response:", response);
    if (response.success) {
      return { success: true, message: 'Registration successful', data: response.data };
    }
    return { success: false, message: response.message || 'Registration failed' };
  } catch (error: Error | any) {
    console.error("❌ Register error:", error);
    return { success: false, message: error.message || 'Registration action failed' };
  }
};

// Function to handle user login
export const handleLogin = async (data: LoginData) => {
  try {
    console.log("🔑 Calling login API...");
    const response = await login(data);
    console.log("📦 API response:", response);
    if (response.success && response.token && response.data) {
      console.log("💾 Setting cookies...");
      await setAuthToken(response.token);
      await setUserData(response.data);
      console.log("✅ Cookies set successfully");
      return { success: true, message: 'Login successful', data: response.data };
    }
    console.log("⚠️ Login response missing token or user");
    return { success: false, message: response.message || 'Login failed' };
  } catch (error: Error | any) {
    console.error("🔴 Login action error:", error);
    return { success: false, message: error.message || 'Login action failed' };
  }
};

// Function to handle user logout
export const handleLogout = async () => {
  await clearAuthCookies();
  redirect('/login');
};

// Function to get current user info (whoami)
export async function handleWhoAmI() {
  try {
    const result = await whoAmI();
    if (result.success) {
      return {
        success: true,
        message: 'User data fetched successfully',
        data: result.data
      };
    }
    return { success: false, message: result.message || 'Failed to fetch user data' };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}

// Function to handle profile update
export async function handleUpdateProfile(profileData: FormData) {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      await setUserData(result.data); // Update cookie with new data
      revalidatePath('/user/profile'); // Revalidate the profile page
      return {
        success: true,
        message: 'Profile updated successfully',
        data: result.data
      };
    }
    return { success: false, message: result.message || 'Failed to update profile' };
  } catch (error: Error | any) {
    return { success: false, message: error.message };
  }
}



// "use server";

// import { login, register } from "../api/auth";
// import { LoginData, RegisterData } from "@/app/(auth)/schema";
// import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
// import { redirect } from "next/navigation";

// export const handleRegister = async (data: RegisterData) => {
//   try {
//     const response = await register(data);
//     console.log("📝 Register response:", response);
//     if (response.success) {
//       return { success: true, message: 'Registration successful', data: response.user };
//     }
//     return { success: false, message: response.message || 'Registration failed' };
//   } catch (error: Error | any) {
//     console.error("❌ Register error:", error);
//     return { success: false, message: error.message || 'Registration action failed' };
//   }
// };

// export const handleLogin = async (data: LoginData) => {
//   try {
//     console.log("🔑 Calling login API...");
//     const response = await login(data);
//     console.log("📦 API response:", response);
//     if (response.success && response.token && response.user) {
//       console.log("💾 Setting cookies...");
//       await setAuthToken(response.token);
//       await setUserData(response.user);
//       console.log("✅ Cookies set successfully");
//       return { success: true, message: 'Login successful', data: response.user };
//     }
//     console.log("⚠️ Login response missing token or user");
//     return { success: false, message: response.message || 'Login failed' };
//   } catch (error: Error | any) {
//     console.error("🔴 Login action error:", error);
//     return { success: false, message: error.message || 'Login action failed' };
//   }
// };

// export const handleLogout = async () => {
//   await clearAuthCookies();
//   redirect('/login');
// };