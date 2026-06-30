import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '@/shared/services/axios'
import { setCookie, getCookie, eraseCookie } from '@/shared/utils/cookies'

export interface Admin {
  id: number
  name: string
  email: string
  phone: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    admin: Admin
    token: string
  }
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: Admin
}

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      const response = await api.post<LoginResponse>('/admin/login', credentials)
      return response.data
    },
    onSuccess: (data) => {
      setCookie('plan-go-token', data.data.token)
      queryClient.setQueryData(['admin-profile'], data.data.admin)
      toast.success(data.message || 'Logged in successfully.')
      navigate('/')
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Invalid credentials.'
      toast.error(msg)
    }
  })
}

export function useProfile() {
  const token = getCookie('plan-go-token')
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/admin/profile')
      return response.data.data
    },
    enabled: !!token,
    retry: false
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ success: boolean; message: string }>('/admin/logout')
      return response.data
    },
    onSuccess: (data) => {
      eraseCookie('plan-go-token')
      queryClient.clear()
      toast.success(data.message || 'Logged out successfully.')
      navigate('/login')
    },
    onError: () => {
      // Even if API logout fails, clear local session
      eraseCookie('plan-go-token')
      queryClient.clear()
      toast.success('Logged out successfully.')
      navigate('/login')
    }
  })
}
