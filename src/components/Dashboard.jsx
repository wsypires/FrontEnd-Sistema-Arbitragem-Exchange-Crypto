import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Dados simulados para os gráficos
const profitData = [
  { time: '00:00', profit: 0 },
  { time: '04:00', profit: 125.50 },
  { time: '08:00', profit: 89.30 },
  { time: '12:00', profit: 234.80 },
  { time: '16:00', profit: 178.90 },
  { time: '20:00', profit: 312.45 },
  { time: '24:00', profit: 289.67 }
]

const spreadData = [
  { time: '00:00', spread: 0.15 },
  { time: '04:00', spread: 0.23 },
  { time: '08:00', spread: 0.18 },
  { time: '12:00', spread: 0.31 },
  { time: '16:00', spread: 0.27 },
  { time: '20:00', spread: 0.19 },
  { time: '24:00', spread: 0.22 }
]

export function Dashboard() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [stats, setStats] = useState({
    totalProfit: 289.67,
    todayProfit: 45.23,
    totalOpportunities: 127,
    executedTrades: 23,
    successRate: 89.5,
    avgSpread: 0.22
  })

  const [recentOpportunities, setRecentOpportunities] = useState([
    {
      id: 1,
      exchangeBuy: 'Binance',
      exchangeSell: 'Coinbase',
      pair: 'USDT/BRL',
      spread: 0.34,
      profit: 12.45,
      status: 'detected',
      time: '14:32:15'
    },
    {
      id: 2,
      exchangeBuy: 'Kraken',
      exchangeSell: 'Binance',
      pair: 'USDT/BRL',
      spread: 0.28,
      profit: 8.90,
      status: 'executed',
      time: '14:28:42'
    },
    {
      id: 3,
      exchangeBuy: 'Coinbase',
      exchangeSell: 'Kraken',
      pair: 'USDT/BRL',
      spread: 0.19,
      profit: 5.67,
      status: 'completed',
      time: '14:25:18'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'detected': return 'bg-yellow-500'
      case 'executed': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'detected': return 'Detectada'
      case 'executed': return 'Executada'
      case 'completed': return 'Concluída'
      case 'failed': return 'Falhou'
      default: return 'Desconhecido'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de oportunidades de arbitragem
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

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +R$ {stats.todayProfit.toFixed(2)} hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              {stats.executedTrades} executadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spread Médio</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSpread}%</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lucro Acumulado</CardTitle>
            <CardDescription>
              Evolução do lucro nas últimas 24 horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Lucro']}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spread Médio</CardTitle>
            <CardDescription>
              Variação do spread ao longo do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spreadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Spread']}
                />
                <Line 
                  type="monotone" 
                  dataKey="spread" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades Recentes</CardTitle>
          <CardDescription>
            Últimas oportunidades de arbitragem detectadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOpportunities.map((opportunity) => (
              <div 
                key={opportunity.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(opportunity.status)}`} />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{opportunity.pair}</span>
                      <Badge variant="outline">{getStatusText(opportunity.status)}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {opportunity.exchangeBuy} → {opportunity.exchangeSell}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      {opportunity.spread.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Spread</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      R$ {opportunity.profit.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Lucro</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-mono">{opportunity.time}</div>
                  </div>

                  {opportunity.status === 'detected' && (
                    <Button size="sm" className="ml-4">
                      Executar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

