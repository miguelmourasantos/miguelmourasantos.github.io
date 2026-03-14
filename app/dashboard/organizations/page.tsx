'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function OrganizationsPage() {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])

  const handleCreateOrganization = async () => {
    setIsCreating(true)
    try {
      // TODO: Implement organization creation
      toast({
        title: 'Em Desenvolvimento',
        description: 'Funcionalidade de criar organizações em desenvolvimento',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar organização',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organizações</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas organizações</p>
        </div>
        <Button onClick={handleCreateOrganization} disabled={isCreating}>
          {isCreating ? 'Criando...' : 'Nova Organização'}
        </Button>
      </div>

      {organizations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhuma organização criada ainda</p>
            <Button onClick={handleCreateOrganization}>
              Criar Primeira Organização
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Membros: {org.memberCount || 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
