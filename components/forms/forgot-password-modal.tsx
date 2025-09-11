'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HelpCircle, Phone, MessageCircle } from 'lucide-react'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
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
          
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">021-1234-5678</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">0812-3456-7890</p>
              </div>
            </div>
          </div>
          
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