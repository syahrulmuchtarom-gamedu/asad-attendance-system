import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, Plus, Edit } from 'lucide-react'

const mockDesa = [
  { id: 1, nama_desa: 'Kapuk Melati', kelompok_count: 3 },
  { id: 2, nama_desa: 'Jelambar', kelompok_count: 4 },
  { id: 3, nama_desa: 'Cengkareng', kelompok_count: 3 },
]

const mockKelompok = [
  { id: 1, nama_kelompok: 'Melati A', desa_name: 'Kapuk Melati', target_putra: 25 },
  { id: 2, nama_kelompok: 'Melati B', desa_name: 'Kapuk Melati', target_putra: 25 },
  { id: 3, nama_kelompok: 'BGN', desa_name: 'Kapuk Melati', target_putra: 25 },
]

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Data</h1>
        <p className="text-muted-foreground">
          Kelola data desa dan kelompok
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Data Desa
            </CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDesa.map((desa) => (
                <div key={desa.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{desa.nama_desa}</p>
                    <p className="text-sm text-muted-foreground">
                      {desa.kelompok_count} kelompok
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Kelompok
            </CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-3 w-3" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockKelompok.map((kelompok) => (
                <div key={kelompok.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{kelompok.nama_kelompok}</p>
                    <p className="text-sm text-muted-foreground">
                      {kelompok.desa_name} • Target: {kelompok.target_putra}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}