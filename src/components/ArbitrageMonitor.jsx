import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react'

export function ArbitrageMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      exchangeBuy: 'Binance',
      exchangeSell: 'Coinbase',
      pair: 'USDT/BRL',
      buyPrice: 5.4523,
      sellPrice: 5.4712,
      spread: 0.34,
      amount: 1000,
      profit: 18.90,
      status: 'detected',
      timestamp: new Date()
    },
    {
      id: 2,
      exchangeBuy: 'Kraken',
      exchangeSell: 'Binance',
      pair: 'USDT/BRL',
      buyPrice: 5.4456,
      sellPrice: 5.4598,
      spread: 0.26,
      amount: 750,
      profit: 10.65,
      status: 'executing',
      timestamp: new Date(Date.now() - 30000)
    }
  ])

  const [monitorStats, setMonitorStats] = useState({
    totalDetected: 45,
    totalExecuted: 12,
    avgSpread: 0.28,
    successRate: 89.5
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected': return 'bg-yellow-500'
      case 'executing': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'detected': return 'Detectada'
      case 'executing': return 'Executando'
      case 'completed': return 'Concluída'
      case 'failed': return 'Falhou'
      default: return 'Desconhecido'
    }
  }

  const executeArbitrage = (opportunityId) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, status: 'executing' }
        : opp
    ))
    
    // Simular execução
    setTimeout(() => {
      setOpportunities(opportunities.map(opp => 
        opp.id === opportunityId 
          ? { ...opp, status: 'completed' }
          : opp
      ))
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitor de Arbitragem</h1>
          <p className="text-muted-foreground">
            Detecção automática de oportunidades em tempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Parar Monitor</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Iniciar Monitor</span>
              </>
            )}
          </Button>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Monitor Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isMonitoring ? 'Ativo' : 'Parado'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isMonitoring ? 'Monitorando exchanges' : 'Monitor desativado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detectadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitorStats.totalDetected}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executadas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitorStats.totalExecuted}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {monitorStats.successRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spread Médio</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitorStats.avgSpread}%</div>
            <Progress value={monitorStats.avgSpread * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades Ativas</CardTitle>
          <CardDescription>
            Oportunidades detectadas e disponíveis para execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhuma oportunidade ativa</h3>
              <p className="text-muted-foreground">
                {isMonitoring 
                  ? 'Aguardando detecção de oportunidades...'
                  : 'Inicie o monitor para detectar oportunidades'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <div 
                  key={opportunity.id}
                  className="flex items-center justify-between p-6 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(opportunity.status)}`} />
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{opportunity.pair}</span>
                        <Badge variant="outline">{getStatusText(opportunity.status)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {opportunity.exchangeBuy} → {opportunity.exchangeSell}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {opportunity.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Compra</div>
                      <div className="font-mono font-medium">
                        R$ {opportunity.buyPrice.toFixed(4)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Venda</div>
                      <div className="font-mono font-medium">
                        R$ {opportunity.sellPrice.toFixed(4)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Spread</div>
                      <div className="font-bold text-green-600">
                        {opportunity.spread.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Lucro</div>
                      <div className="font-bold text-green-600">
                        R$ {opportunity.profit.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Quantidade</div>
                      <div className="font-mono">
                        {opportunity.amount.toLocaleString()}
                      </div>
                    </div>

                    {opportunity.status === 'detected' && (
                      <Button 
                        onClick={() => executeArbitrage(opportunity.id)}
                        className="ml-4"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Executar
                      </Button>
                    )}
                    
                    {opportunity.status === 'executing' && (
                      <Button disabled className="ml-4">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Executando...
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitor Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Monitor</CardTitle>
          <CardDescription>
            Ajuste os parâmetros de detecção de oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Spread Mínimo (%)</label>
              <input 
                type="number" 
                step="0.01" 
                defaultValue="0.20"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Intervalo (segundos)</label>
              <input 
                type="number" 
                defaultValue="5"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Quantidade Máxima</label>
              <input 
                type="number" 
                defaultValue="1000"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline">
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

