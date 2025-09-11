'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import { ForgotPasswordModal } from '@/components/forms/forgot-password-modal'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true)
      
      const loginData = {
        username: data.email, // field name tetap email tapi isinya username
        password: data.password,
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      
      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: result.error || 'Username atau password salah',
        })
        return
      }

      // SAVE TO LOCALSTORAGE AS BACKUP
      localStorage.setItem('user_session', JSON.stringify(result.user))
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di Sistem Absensi ASAD",
      })

      // Force reload to ensure session is set
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login error:', error)
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Silakan coba lagi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <div className="absolute -top-16 right-0">
        <SimpleThemeToggle />
      </div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Masuk ke Sistem Absensi ASAD
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="admin, koordinator, viewer"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                {...register('password')}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Memproses...' : 'Login'}
          </Button>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Lupa Password?
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
    
    <ForgotPasswordModal 
      isOpen={showForgotPassword} 
      onClose={() => setShowForgotPassword(false)} 
    />
    </div>
  )
}
