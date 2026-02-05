// app/lib/actions/admin/user_action.ts

"use server";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../api/admin/user';
import { revalidatePath } from 'next/cache';

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUser(data);
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User created successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Create user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Create user action failed' };
    }
};

export const handleGetAllUsers = async () => {
    try {
        const response = await getAllUsers();
        if (response.success) {
            return {
                success: true,
                message: 'Users fetched successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Get users failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get users action failed' };
    }
};

export const handleGetUserById = async (id: string) => {
    try {
        const response = await getUserById(id);
        if (response.success) {
            return {
                success: true,
                message: 'User fetched successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Get user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Get user action failed' };
    }
};

export const handleUpdateUser = async (id: string, data: FormData) => {
    try {
        const response = await updateUser(id, data);
        if (response.success) {
            revalidatePath('/admin/users');
            revalidatePath(`/admin/users/${id}`);
            return {
                success: true,
                message: 'User updated successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Update user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update user action failed' };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id);
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'User deleted successfully'
            };
        }
        return {
            success: false,
            message: response.message || 'Delete user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete user action failed' };
    }
};