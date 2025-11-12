import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Wifi,
  DollarSign,
  AlertTriangle,
  Loader2,
  Settings
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const supportedExchanges = [
  { value: 'binance', label: 'Binance', requiresPassphrase: false },
  { value: 'coinbase', label: 'Coinbase Pro', requiresPassphrase: true },
  { value: 'kraken', label: 'Kraken', requiresPassphrase: false },
  { value: 'bitfinex', label: 'Bitfinex', requiresPassphrase: false },
  { value: 'huobi', label: 'Huobi', requiresPassphrase: false },
  { value: 'okx', label: 'OKX', requiresPassphrase: true },
  { value: 'bybit', label: 'Bybit', requiresPassphrase: false }
]

const API_BASE_URL = 'http://localhost:8000/api/v1'

export function ExchangeConfig() {
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExchange, setEditingExchange] = useState(null)
  const [showApiKey, setShowApiKey] = useState({})
  const [showApiSecret, setShowApiSecret] = useState({})
  const [testingConnection, setTestingConnection] = useState({})
  const [loadingBalance, setLoadingBalance] = useState({})
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    api_key: '',
    api_secret: '',
    api_passphrase: '',
    sandbox: false,
    max_order_amount: 1000.0,
    min_balance_threshold: 10.0
  })

  // Carregar exchanges ao montar o componente
  useEffect(() => {
    loadExchanges()
  }, [])

  const loadExchanges = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/exchanges/`)
      if (response.ok) {
        const data = await response.json()
        setExchanges(data)
      } else {
        throw new Error('Erro ao carregar exchanges')
      }
    } catch (err) {
      setError('Erro ao carregar exchanges: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      display_name: '',
      api_key: '',
      api_secret: '',
      api_passphrase: '',
      sandbox: false,
      max_order_amount: 1000.0,
      min_balance_threshold: 10.0
    })
    setEditingExchange(null)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    try {
      const url = editingExchange 
        ? `${API_BASE_URL}/exchanges/${editingExchange.id}`
        : `${API_BASE_URL}/exchanges/`
      
      const method = editingExchange ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await loadExchanges()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Erro ao salvar exchange')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (exchange) => {
    setEditingExchange(exchange)
    setFormData({
      name: exchange.name,
      display_name: exchange.display_name || '',
      api_key: '',
      api_secret: '',
      api_passphrase: '',
      sandbox: exchange.sandbox,
      max_order_amount: exchange.max_order_amount,
      min_balance_threshold: exchange.min_balance_threshold
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta exchange?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/exchanges/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await loadExchanges()
      } else {
        throw new Error('Erro ao excluir exchange')
      }
    } catch (err) {
      setError('Erro ao excluir exchange: ' + err.message)
    }
  }

  const toggleActive = async (id) => {
    try {
      const exchange = exchanges.find(ex => ex.id === id)
      const response = await fetch(`${API_BASE_URL}/exchanges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !exchange.is_active
        }),
      })
      
      if (response.ok) {
        await loadExchanges()
      } else {
        throw new Error('Erro ao atualizar status da exchange')
      }
    } catch (err) {
      setError('Erro ao atualizar exchange: ' + err.message)
    }
  }

  const testConnection = async (id) => {
    try {
      setTestingConnection(prev => ({ ...prev, [id]: true }))
      const response = await fetch(`${API_BASE_URL}/exchanges/${id}/test-connection`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const result = await response.json()
        await loadExchanges()
        
        if (result.success) {
          alert('Conexão testada com sucesso!')
        } else {
          alert(`Falha na conexão: ${result.message}`)
        }
      } else {
        throw new Error('Erro ao testar conexão')
      }
    } catch (err) {
      setError('Erro ao testar conexão: ' + err.message)
    } finally {
      setTestingConnection(prev => ({ ...prev, [id]: false }))
    }
  }

  const updateBalance = async (id) => {
    try {
      setLoadingBalance(prev => ({ ...prev, [id]: true }))
      const response = await fetch(`${API_BASE_URL}/exchanges/${id}/balance`)
      
      if (response.ok) {
        const balance = await response.json()
        alert(`Saldo atualizado: ${JSON.stringify(balance.balances, null, 2)}`)
      } else {
        throw new Error('Erro ao obter saldo')
      }
    } catch (err) {
      setError('Erro ao obter saldo: ' + err.message)
    } finally {
      setLoadingBalance(prev => ({ ...prev, [id]: false }))
    }
  }

  const toggleApiKeyVisibility = (id) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleApiSecretVisibility = (id) => {
    setShowApiSecret(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getConnectionStatusBadge = (exchange) => {
    const status = exchange.connection_status
    const isConnected = status === 'connected'
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Conectado
                </>
              ) : status === 'error' ? (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Erro
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Desconectado
                </>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{exchange.connection_error_message || 'Status da conexão'}</p>
            {exchange.last_connection_test && (
              <p className="text-xs">
                Último teste: {new Date(exchange.last_connection_test).toLocaleString()}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const selectedExchange = supportedExchanges.find(ex => ex.value === formData.name)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando exchanges...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração de Exchanges</h1>
          <p className="text-muted-foreground">
            Gerencie suas conexões com exchanges de criptomoedas usando APIs privadas
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Exchange
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingExchange ? 'Editar Exchange' : 'Adicionar Exchange'}
              </DialogTitle>
              <DialogDescription>
                Configure as credenciais da API privada para conectar com a exchange.
                Suas chaves serão criptografadas e armazenadas com segurança.
              </DialogDescription>
            </DialogHeader>
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exchange-name">Exchange *</Label>
                <Select 
                  value={formData.name} 
                  onValueChange={(value) => setFormData({...formData, name: value})}
                  disabled={editingExchange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedExchanges.map((exchange) => (
                      <SelectItem key={exchange.value} value={exchange.value}>
                        {exchange.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">Nome de Exibição</Label>
                <Input
                  id="display-name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  placeholder="Nome personalizado (opcional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key *</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={formData.api_key}
                  onChange={(e) => setFormData({...formData, api_key: e.target.value})}
                  placeholder="Sua API Key privada"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret *</Label>
                <Input
                  id="api-secret"
                  type="password"
                  value={formData.api_secret}
                  onChange={(e) => setFormData({...formData, api_secret: e.target.value})}
                  placeholder="Sua API Secret privada"
                  required
                />
              </div>

              {selectedExchange?.requiresPassphrase && (
                <div className="space-y-2">
                  <Label htmlFor="api-passphrase">API Passphrase *</Label>
                  <Input
                    id="api-passphrase"
                    type="password"
                    value={formData.api_passphrase}
                    onChange={(e) => setFormData({...formData, api_passphrase: e.target.value})}
                    placeholder="Passphrase da API"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-order">Valor Máximo por Ordem</Label>
                  <Input
                    id="max-order"
                    type="number"
                    step="0.01"
                    value={formData.max_order_amount}
                    onChange={(e) => setFormData({...formData, max_order_amount: parseFloat(e.target.value)})}
                    placeholder="1000.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min-balance">Saldo Mínimo</Label>
                  <Input
                    id="min-balance"
                    type="number"
                    step="0.01"
                    value={formData.min_balance_threshold}
                    onChange={(e) => setFormData({...formData, min_balance_threshold: parseFloat(e.target.value)})}
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sandbox"
                  checked={formData.sandbox}
                  onCheckedChange={(checked) => setFormData({...formData, sandbox: checked})}
                />
                <Label htmlFor="sandbox">Modo Sandbox/Testnet</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingExchange ? 'Salvar Alterações' : 'Adicionar Exchange'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Exchanges List */}
      <div className="grid gap-4">
        {exchanges.map((exchange) => (
          <Card key={exchange.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {exchange.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <CardTitle className="capitalize">
                      {exchange.display_name || exchange.name}
                    </CardTitle>
                    <CardDescription>
                      {exchange.sandbox ? 'Ambiente de Teste' : 'Ambiente de Produção'}
                      {exchange.name !== (exchange.display_name || exchange.name).toLowerCase() && (
                        <span className="ml-2 text-xs">({exchange.name})</span>
                      )}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getConnectionStatusBadge(exchange)}
                  
                  <Badge variant={exchange.is_active ? "default" : "secondary"}>
                    {exchange.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* API Credentials */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">API Key</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        type="text"
                        value={exchange.api_key}
                        readOnly
                        className="text-sm font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Configurações</Label>
                    <div className="mt-1 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Valor máximo:</span>
                        <span className="font-mono">$ {exchange.max_order_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo mínimo:</span>
                        <span className="font-mono">$ {exchange.min_balance_threshold.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={exchange.is_active}
                      onCheckedChange={() => toggleActive(exchange.id)}
                    />
                    <Label className="text-sm">Ativo</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(exchange.id)}
                      disabled={testingConnection[exchange.id]}
                    >
                      {testingConnection[exchange.id] ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wifi className="w-4 h-4 mr-2" />
                      )}
                      Testar Conexão
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBalance(exchange.id)}
                      disabled={loadingBalance[exchange.id]}
                    >
                      {loadingBalance[exchange.id] ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <DollarSign className="w-4 h-4 mr-2" />
                      )}
                      Obter Saldo
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(exchange)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(exchange.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exchanges.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Nenhuma exchange configurada</h3>
              <p className="text-muted-foreground mt-2">
                Adicione pelo menos duas exchanges com APIs privadas para começar a detectar 
                oportunidades de arbitragem entre elas.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Exchange
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

