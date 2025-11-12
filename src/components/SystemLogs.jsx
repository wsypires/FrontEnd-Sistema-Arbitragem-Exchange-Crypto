import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
  Zap,
  Info,
  AlertCircle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const API_BASE_URL = 'http://localhost:8000/api/v1'

const LOG_TYPES = {
  'opportunity_detected': { label: 'Oportunidade Detectada', icon: Zap, color: 'text-blue-600' },
  'execution_result': { label: 'Resultado de Execução', icon: Activity, color: 'text-green-600' },
  'connection_alert': { label: 'Alerta de Conexão', icon: AlertTriangle, color: 'text-yellow-600' },
  'system_alert': { label: 'Alerta do Sistema', icon: AlertCircle, color: 'text-red-600' },
  'monitor_status': { label: 'Status do Monitor', icon: CheckCircle, color: 'text-gray-600' },
  'arbitrage_alert': { label: 'Alerta de Arbitragem', icon: Zap, color: 'text-purple-600' }
}

const LOG_LEVELS = {
  'info': { label: 'Info', variant: 'secondary' },
  'warning': { label: 'Aviso', variant: 'destructive' },
  'error': { label: 'Erro', variant: 'destructive' },
  'success': { label: 'Sucesso', variant: 'default' },
  'high': { label: 'Alta', variant: 'default' },
  'medium': { label: 'Média', variant: 'secondary' },
  'low': { label: 'Baixa', variant: 'outline' }
}

export function SystemLogs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // Filtros
  const [filters, setFilters] = useState({
    type: 'all',
    level: 'all',
    search: '',
    timeRange: '24h'
  })
  
  const [selectedLog, setSelectedLog] = useState(null)

  useEffect(() => {
    loadLogs()
    // Atualizar logs a cada 30 segundos
    const interval = setInterval(loadLogs, 30000)
    return () => clearInterval(interval)
  }, [filters.timeRange])

  useEffect(() => {
    applyFilters()
  }, [logs, filters])

  const loadLogs = async () => {
    try {
      setRefreshing(true)
      
      // Carregar histórico de alertas
      const response = await fetch(`${API_BASE_URL}/alerts/history?limit=100`)
      
      if (response.ok) {
        const alertHistory = await response.json()
        setLogs(alertHistory)
        setError(null)
      } else {
        throw new Error('Erro ao carregar logs')
      }
    } catch (err) {
      setError('Erro ao carregar logs: ' + err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...logs]

    // Filtrar por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(log => log.type === filters.type)
    }

    // Filtrar por nível
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.alert_level === filters.level)
    }

    // Filtrar por busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(log => 
        JSON.stringify(log.data).toLowerCase().includes(searchLower) ||
        log.type.toLowerCase().includes(searchLower)
      )
    }

    // Filtrar por tempo
    if (filters.timeRange !== 'all') {
      const now = new Date()
      let cutoff
      
      switch (filters.timeRange) {
        case '1h':
          cutoff = new Date(now.getTime() - 60 * 60 * 1000)
          break
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        default:
          cutoff = null
      }
      
      if (cutoff) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= cutoff)
      }
    }

    // Ordenar por timestamp (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    setFilteredLogs(filtered)
  }

  const clearLogs = async () => {
    if (!confirm('Tem certeza que deseja limpar todos os logs?')) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/clear`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setLogs([])
        setFilteredLogs([])
      } else {
        throw new Error('Erro ao limpar logs')
      }
    } catch (err) {
      setError('Erro ao limpar logs: ' + err.message)
    }
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getLogIcon = (log) => {
    const logType = LOG_TYPES[log.type]
    if (logType) {
      const Icon = logType.icon
      return <Icon className={`w-4 h-4 ${logType.color}`} />
    }
    return <Info className="w-4 h-4 text-gray-600" />
  }

  const getLogTitle = (log) => {
    switch (log.type) {
      case 'opportunity_detected':
        return `Oportunidade: ${log.data.trading_pair} (${log.data.spread_percentage?.toFixed(2)}%)`
      case 'execution_result':
        return `Execução ${log.data.success ? 'Bem-sucedida' : 'Falhada'}: ${log.data.trading_pair}`
      case 'connection_alert':
        return log.data.title || 'Alerta de Conexão'
      case 'system_alert':
        return log.data.alert_type || 'Alerta do Sistema'
      case 'monitor_status':
        return `Monitor ${log.data.status === 'started' ? 'Iniciado' : 'Parado'}`
      case 'arbitrage_alert':
        return log.data.title || 'Alerta de Arbitragem'
      default:
        return log.type
    }
  }

  const getLogDescription = (log) => {
    switch (log.type) {
      case 'opportunity_detected':
        return `${log.data.exchange_buy} → ${log.data.exchange_sell} | Lucro: $${log.data.potential_profit?.toFixed(2)}`
      case 'execution_result':
        return log.data.message
      case 'connection_alert':
        return log.data.message
      case 'system_alert':
        return log.data.message
      case 'monitor_status':
        return log.data.message
      case 'arbitrage_alert':
        return log.data.message
      default:
        return JSON.stringify(log.data)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando logs...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs do Sistema</h1>
          <p className="text-muted-foreground">
            Histórico de atividades e alertas do sistema de arbitragem
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button onClick={clearLogs} variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
          
          <Button onClick={loadLogs} disabled={refreshing} size="sm">
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {Object.entries(LOG_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nível</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters({...filters, level: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  {Object.entries(LOG_LEVELS).map(([key, level]) => (
                    <SelectItem key={key} value={key}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={filters.timeRange} onValueChange={(value) => setFilters({...filters, timeRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Última hora</SelectItem>
                  <SelectItem value="24h">Últimas 24 horas</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="all">Todo o período</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nos logs..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Logs ({filteredLogs.length})
          </CardTitle>
          <CardDescription>
            {filteredLogs.length === 0 ? 'Nenhum log encontrado com os filtros aplicados' : 
             `Mostrando ${filteredLogs.length} de ${logs.length} logs`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLogs.map((log, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        {getLogIcon(log)}
                        <div>
                          <p className="font-medium text-sm">
                            {getLogTitle(log)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getLogDescription(log)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={LOG_LEVELS[log.alert_level]?.variant || 'secondary'}>
                          {LOG_LEVELS[log.alert_level]?.label || log.alert_level}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        {getLogIcon(log)}
                        <span className="ml-2">{getLogTitle(log)}</span>
                      </DialogTitle>
                      <DialogDescription>
                        {new Date(log.timestamp).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Tipo</Label>
                        <p className="text-sm">{LOG_TYPES[log.type]?.label || log.type}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Nível</Label>
                        <Badge variant={LOG_LEVELS[log.alert_level]?.variant || 'secondary'}>
                          {LOG_LEVELS[log.alert_level]?.label || log.alert_level}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Dados</Label>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-40">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

