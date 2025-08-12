import { lazy } from 'react';

// Core Pages
export const HomePage = lazy(() => import('./core/HomePage'));

// Auth Module
export const LoginPage = lazy(() => import('./modules/auth/LoginPage'));
export const RegisterPage = lazy(() => import('./modules/auth/RegisterPage'));

// Storage Module
export const StoragePage = lazy(() => import('./modules/storage/StoragePage'));

// Admin Module
export const AdminPage = lazy(() => import('./admin/AdminPage'));
