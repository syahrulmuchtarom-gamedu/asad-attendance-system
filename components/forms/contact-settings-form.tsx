'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Phone, MessageCircle, Save } from 'lucide-react'

export function ContactSettingsForm() {
  const [formData, setFormData] = useState({
    admin_phone: '',
    admin_whatsapp: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsFetching(true)
      const response = await fetch('/api/settings')
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid response format')
      }
      
      // Use reduce for better performance
      const newFormData = result.data.reduce((acc: any, setting: any) => {
        if (setting.key === 'admin_phone') {
          acc.admin_phone = setting.value
        } else if (setting.key === 'admin_whatsapp') {
          acc.admin_whatsapp = setting.value
        }
        return acc
      }, {
        admin_phone: '021-1234-5678',
        admin_whatsapp: '0812-3456-7890'
      })
      
      setFormData(newFormData)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data kontak",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi input
    const phoneRegex = /^[0-9+\-\s()]+$/
    
    if (!formData.admin_phone.trim() || !formData.admin_whatsapp.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi",
      })
      return
    }
    
    if (!phoneRegex.test(formData.admin_phone) || !phoneRegex.test(formData.admin_whatsapp)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Format nomor telepon tidak valid",
      })
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      let result
      try {
        result = await response.json()
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError)
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      toast({
        title: "Berhasil",
        description: "Kontak admin berhasil diupdate",
      })

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message || "Terjadi kesalahan",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Kontak Admin untuk Lupa Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin_phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Nomor Telepon
            </Label>
            <Input
              id="admin_phone"
              type="tel"
              value={formData.admin_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, admin_phone: e.target.value }))}
              placeholder="021-1234-5678"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin_whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Nomor WhatsApp
            </Label>
            <Input
              id="admin_whatsapp"
              type="tel"
              value={formData.admin_whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, admin_whatsapp: e.target.value }))}
              placeholder="0812-3456-7890"
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Menyimpan...' : 'Simpan Kontak'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}