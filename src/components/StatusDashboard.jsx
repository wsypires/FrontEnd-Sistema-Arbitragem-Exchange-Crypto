import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Play,
  Pause,
  RefreshCw,
  Server,
  TrendingUp,
  Wifi,
  WifiOff,
  XCircle,
  Zap
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export function StatusDashboard() {
  const [systemStatus, setSystemStatus] = useState({
    arbitrage_monitor: { is_running: false, last_check: null },
    connection_monitor: { is_running: false, total_exchanges: 0, connected_count: 0 },
    exchanges: [],
    recent_opportunities: [],
    statistics: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadSystemStatus()
    // Atualizar status a cada 30 segundos
    const interval = setInterval(loadSystemStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadSystemStatus = async () => {
    try {
      setRefreshing(true)
      
      // Carregar status dos monitores
      const [arbitrageStatus, connectionStatus, exchanges, opportunities, stats] = await Promise.all([
        fetch(`${API_BASE_URL}/monitor/status`).then(r => r.json()).catch(() => ({ is_running: false })),
        fetch(`${API_BASE_URL}/monitor/connections/status`).then(r => r.json()).catch(() => ({ is_monitoring: false, total_exchanges: 0, connected_count: 0 })),
        fetch(`${API_BASE_URL}/exchanges/`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE_URL}/arbitrage/opportunities?limit=5`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE_URL}/arbitrage/statistics`).then(r => r.json()).catch(() => ({}))
      ])

      setSystemStatus({
        arbitrage_monitor: arbitrageStatus,
        connection_monitor: connectionStatus,
        exchanges: exchanges,
        recent_opportunities: opportunities,
        statistics: stats
      })
      
      setError(null)
    } catch (err) {
      setError('Erro ao carregar status do sistema: ' + err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const toggleArbitrageMonitor = async () => {
    try {
      const endpoint = systemStatus.arbitrage_monitor.is_running ? 'stop' : 'start'
      const response = await fetch(`${API_BASE_URL}/monitor/${endpoint}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await loadSystemStatus()
      } else {
        throw new Error('Erro ao alterar status do monitor')
      }
    } catch (err) {
      setError('Erro ao controlar monitor: ' + err.message)
    }
  }

  const toggleConnectionMonitor = async () => {
    try {
      const endpoint = systemStatus.connection_monitor.is_monitoring ? 'stop' : 'start'
      const response = await fetch(`${API_BASE_URL}/monitor/connections/${endpoint}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        await loadSystemStatus()
      } else {
        throw new Error('Erro ao alterar status do monitor de conexões')
      }
    } catch (err) {
      setError('Erro ao controlar monitor de conexões: ' + err.message)
    }
  }

  const getConnectionRate = () => {
    const { total_exchanges, connected_count } = systemStatus.connection_monitor
    return total_exchanges > 0 ? (connected_count / total_exchanges) * 100 : 0
  }

  const getSystemHealthStatus = () => {
    const connectionRate = getConnectionRate()
    const hasActiveExchanges = systemStatus.exchanges.some(ex => ex.is_active)
    
    if (!hasActiveExchanges) return { status: 'warning', message: 'Nenhuma exchange ativa' }
    if (connectionRate === 100) return { status: 'healthy', message: 'Sistema operacional' }
    if (connectionRate >= 50) return { status: 'warning', message: 'Algumas conexões com problema' }
    return { status: 'error', message: 'Múltiplas conexões com problema' }
  }

  const systemHealth = getSystemHealthStatus()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Carregando status do sistema...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status do Sistema</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real do sistema de arbitragem
          </p>
        </div>
        
        <Button 
          onClick={loadSystemStatus} 
          disabled={refreshing}
          variant="outline"
          className="mt-4 sm:mt-0"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
            {systemHealth.status === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : systemHealth.status === 'warning' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={
                systemHealth.status === 'healthy' ? 'default' : 
                systemHealth.status === 'warning' ? 'secondary' : 'destructive'
              }>
                {systemHealth.message}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchanges Conectadas</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus.connection_monitor.connected_count}/{systemStatus.connection_monitor.total_exchanges}
            </div>
            <Progress value={getConnectionRate()} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {getConnectionRate().toFixed(0)}% conectadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStatus.statistics.total_opportunities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemStatus.statistics.executed_opportunities || 0} executadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Potencial</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(systemStatus.statistics.total_potential_profit || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Spread médio: {(systemStatus.statistics.average_spread || 0).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monitor Controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Monitor de Arbitragem
            </CardTitle>
            <CardDescription>
              Sistema de detecção automática de oportunidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={systemStatus.arbitrage_monitor.is_running ? "default" : "secondary"}>
                  {systemStatus.arbitrage_monitor.is_running ? (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Parado
                    </>
                  )}
                </Badge>
                
                {systemStatus.arbitrage_monitor.last_check && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Última verificação: {new Date(systemStatus.arbitrage_monitor.last_check).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <Button
                onClick={toggleArbitrageMonitor}
                variant={systemStatus.arbitrage_monitor.is_running ? "destructive" : "default"}
                size="sm"
              >
                {systemStatus.arbitrage_monitor.is_running ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Monitor de Conexões
            </CardTitle>
            <CardDescription>
              Verificação contínua do status das exchanges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant={systemStatus.connection_monitor.is_monitoring ? "default" : "secondary"}>
                  {systemStatus.connection_monitor.is_monitoring ? (
                    <>
                      <Wifi className="w-3 h-3 mr-1" />
                      Monitorando
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 mr-1" />
                      Parado
                    </>
                  )}
                </Badge>
                
                <span className="text-sm text-muted-foreground">
                  Intervalo: {systemStatus.connection_monitor.check_interval || 300}s
                </span>
              </div>
              
              <Button
                onClick={toggleConnectionMonitor}
                variant={systemStatus.connection_monitor.is_monitoring ? "destructive" : "default"}
                size="sm"
              >
                {systemStatus.connection_monitor.is_monitoring ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Exchanges</CardTitle>
          <CardDescription>
            Status de conexão e configuração de cada exchange
          </CardDescription>
        </CardHeader>
        <CardContent>
          {systemStatus.exchanges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma exchange configurada</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {systemStatus.exchanges.map((exchange) => (
                <div key={exchange.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {exchange.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <p className="font-medium capitalize">
                        {exchange.display_name || exchange.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exchange.sandbox ? 'Sandbox' : 'Produção'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={exchange.connection_status === 'connected' ? "default" : "destructive"}>
                      {exchange.connection_status === 'connected' ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Conectado
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          {exchange.connection_status || 'Desconectado'}
                        </>
                      )}
                    </Badge>
                    
                    <Badge variant={exchange.is_active ? "default" : "secondary"}>
                      {exchange.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Oportunidades Recentes
          </CardTitle>
          <CardDescription>
            Últimas oportunidades de arbitragem detectadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {systemStatus.recent_opportunities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma oportunidade recente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {systemStatus.recent_opportunities.map((opportunity) => (
                <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {opportunity.trading_pair}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {opportunity.exchange_buy} → {opportunity.exchange_sell}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(opportunity.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={opportunity.spread_percentage >= 1 ? "default" : "secondary"}>
                      {opportunity.spread_percentage.toFixed(3)}%
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      ${opportunity.potential_profit.toFixed(2)} lucro
                    </p>
                    <Badge variant={
                      opportunity.status === 'executed' ? 'default' :
                      opportunity.status === 'failed' ? 'destructive' : 'secondary'
                    } className="mt-1">
                      {opportunity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

