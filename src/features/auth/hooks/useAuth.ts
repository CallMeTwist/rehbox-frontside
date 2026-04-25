// import { useAuthStore } from "@/store/authStore";
// import { useNavigate } from "react-router-dom";
// import { mockPT, mockClient } from "@/mock/data";

// export function useAuth() {
//   const { user, isAuthenticated, login, logout, updateUser, addCoins } = useAuthStore();
//   const navigate = useNavigate();

//   const loginAsPT = async (email: string, _password: string) => {
//     await new Promise((r) => setTimeout(r, 800));
//     login(mockPT, "mock-token-pt");
//     navigate("/pt/home");
//   };

//   const loginAsClient = async (email: string, _password: string) => {
//     await new Promise((r) => setTimeout(r, 800));
//     login(mockClient, "mock-token-client");
//     navigate("/client/home");
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return {
//     user,
//     isAuthenticated,
//     isPT: user?.role === "physiotherapist",
//     isClient: user?.role === "client",
//     isVetted: user?.vettingStatus === "approved",
//     isSubscribed: user?.isSubscribed,
//     loginAsPT,
//     loginAsClient,
//     logout: handleLogout,
//     updateUser,
//     addCoins,
//   };
// }


// src/features/auth/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function usePTRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post('/auth/pt/register', formData),
    onSuccess: ({ data }) => {
      setAuth({ ...data.user, subscriptionPlan: data.user.subscription_plan, assessmentCompletedAt: data.user.assessment_completed_at }, data.token);
      toast.success('Registration submitted! Awaiting vetting (up to 48hrs).');
      navigate('/pt/home');
    },
    onError: (err: any) => {
      // const msg = err.response?.data?.message ?? 'Registration failed.';
      // toast.error(msg);
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        toast.error(firstError[0]);
      } else {
        toast.error(err.response?.data?.message ?? 'Registration failed.');
      }
    },
  });
}

export function useClientRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.post('/auth/client/register', data),
    onSuccess: ({ data }) => {
      setAuth({ ...data.user, subscriptionPlan: data.user.subscription_plan, assessmentCompletedAt: data.user.assessment_completed_at }, data.token);
      toast.success('Welcome to ReHboX!');
      navigate('/client/home');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Registration failed.');
    },
  });
}

export function usePTLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/pt/login', data),
    onSuccess: ({ data }) => {
      setAuth({ ...data.user, subscriptionPlan: data.user.subscription_plan, assessmentCompletedAt: data.user.assessment_completed_at }, data.token);
      navigate('/pt/home');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Login failed.');
    },
  });
}

export function useClientLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post('/auth/client/login', data),
    onSuccess: ({ data }) => {
      setAuth({ ...data.user, subscriptionPlan: data.user.subscription_plan, assessmentCompletedAt: data.user.assessment_completed_at }, data.token);
      navigate('/client/home');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Login failed.');
    },
  });
}