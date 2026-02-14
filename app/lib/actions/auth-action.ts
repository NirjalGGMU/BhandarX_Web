// // app/lib/actions/auth-action.ts


// app/lib/actions/auth-action.ts

import { LoginData, RegisterData } from "@/app/(auth)/schema";
import axios from "./axios";
import { API } from "./endpoints";

export const register = async (registerData: RegisterData) => {
    try {
        // Transform the data to match backend expectations
        const payload = {
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email,
            username: registerData.username,
            password: registerData.password,
            confirmPassword: registerData.confirmPassword,
        };
        
        const response = await axios.post(API.AUTH.REGISTER, payload);
        return response.data;
    } catch (error: Error | any) {
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        console.error("API Registration Error:", error.response?.data);
        throw new Error(errorMessage);
    }
};

export const login = async (loginData: LoginData) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData);
        return response.data;
    } catch (error: Error | any) {
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        console.error("API Login Error:", error.response?.data);
        throw new Error(errorMessage);
    }
};

export const whoAmI = async () => {
    try {
        const response = await axios.get(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: Error | any) {
        const errorMessage = error.response?.data?.message || error.message || 'Whoami failed';
        throw new Error(errorMessage);
    }
};

export const updateProfile = async (profileData: any) => {
    try {
        const response = await axios.put(
            API.AUTH.UPDATEPROFILE,
            profileData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        return response.data;
    } catch (error: Error | any) {
        const errorMessage = error.response?.data?.message || error.message || 'Update profile failed';
        throw new Error(errorMessage);
    }
};



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