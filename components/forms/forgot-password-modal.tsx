'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HelpCircle, Phone, MessageCircle } from 'lucide-react'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactSettings {
  admin_phone: string
  admin_whatsapp: string
}

// Default contact values
const DEFAULT_CONTACTS: ContactSettings = {
  admin_phone: '021-1234-5678',
  admin_whatsapp: '0812-3456-7890'
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [contacts, setContacts] = useState<ContactSettings>(DEFAULT_CONTACTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchContacts()
    }
  }, [isOpen])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      
      // Try settings API first, fallback to users API
      let response = await fetch('/api/settings')
      if (!response.ok && response.status === 405) {
        // Fallback: use users API to get settings
        response = await fetch('/api/users?action=get_settings')
      }
      
      if (!response.ok) {
        console.error('Failed to fetch contacts:', response.status)
        return
      }
      
      const result = await response.json()
      
      if (!result.data || !Array.isArray(result.data)) {
        console.error('Invalid response format:', result)
        return
      }
      
      const contactData = result.data.reduce((acc: ContactSettings, setting: any) => {
        if (setting.key === 'admin_phone' && setting.value) {
          acc.admin_phone = setting.value
        } else if (setting.key === 'admin_whatsapp' && setting.value) {
          acc.admin_whatsapp = setting.value
        }
        return acc
      }, { ...DEFAULT_CONTACTS })
      
      setContacts(contactData)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Lupa Password?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Untuk mereset password, silakan hubungi Super Admin melalui kontak di bawah ini:
          </p>
          
          {loading ? (
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Loading kontak...</p>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Telepon</p>
                  <p className="text-sm text-muted-foreground">{contacts.admin_phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">{contacts.admin_whatsapp}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Langkah-langkah:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Hubungi Super Admin</li>
              <li>Berikan username Anda</li>
              <li>Admin akan mereset password</li>
              <li>Login dengan password baru</li>
            </ol>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Mengerti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}