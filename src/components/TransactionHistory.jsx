import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TransactionHistory() {
  const [transactions] = useState([
    {
      id: 1,
      timestamp: new Date('2024-01-15T14:32:15'),
      pair: 'USDT/BRL',
      type: 'arbitrage',
      buyExchange: 'Binance',
      sellExchange: 'Coinbase',
      buyPrice: 5.4523,
      sellPrice: 5.4712,
      amount: 1000,
      profit: 18.90,
      fees: 2.45,
      netProfit: 16.45,
      status: 'completed'
    },
    {
      id: 2,
      timestamp: new Date('2024-01-15T14:28:42'),
      pair: 'USDT/BRL',
      type: 'arbitrage',
      buyExchange: 'Kraken',
      sellExchange: 'Binance',
      buyPrice: 5.4456,
      sellPrice: 5.4598,
      amount: 750,
      profit: 10.65,
      fees: 1.85,
      netProfit: 8.80,
      status: 'completed'
    },
    {
      id: 3,
      timestamp: new Date('2024-01-15T14:25:18'),
      pair: 'USDT/BRL',
      type: 'arbitrage',
      buyExchange: 'Coinbase',
      sellExchange: 'Kraken',
      buyPrice: 5.4389,
      sellPrice: 5.4492,
      amount: 500,
      profit: 5.15,
      fees: 1.20,
      netProfit: 3.95,
      status: 'completed'
    },
    {
      id: 4,
      timestamp: new Date('2024-01-15T14:20:05'),
      pair: 'USDT/BRL',
      type: 'arbitrage',
      buyExchange: 'Binance',
      sellExchange: 'Coinbase',
      buyPrice: 5.4234,
      sellPrice: 5.4298,
      amount: 800,
      profit: 5.12,
      fees: 1.95,
      netProfit: 3.17,
      status: 'failed'
    }
  ])

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    exchange: 'all',
    dateRange: '24h'
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluída'
      case 'failed': return 'Falhou'
      case 'pending': return 'Pendente'
      default: return 'Desconhecido'
    }
  }

  const totalProfit = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.netProfit, 0)

  const totalFees = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.fees, 0)

  const successRate = (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico de Transações</h1>
          <p className="text-muted-foreground">
            Acompanhe todas as operações de arbitragem realizadas
          </p>
        </div>
        
        <Button className="mt-4 sm:mt-0">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalProfit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxas Pagas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalFees.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total em taxas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {successRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.status === 'completed').length} de {transactions.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Médio</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalProfit / transactions.filter(t => t.status === 'completed').length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por transação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.exchange} onValueChange={(value) => setFilters({...filters, exchange: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Exchange" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Exchanges</SelectItem>
                <SelectItem value="binance">Binance</SelectItem>
                <SelectItem value="coinbase">Coinbase</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Última hora</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>
            Lista detalhada de todas as operações realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(transaction.status)}`} />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{transaction.pair}</span>
                      <Badge variant="outline">{getStatusText(transaction.status)}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.buyExchange} → {transaction.sellExchange}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {transaction.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Compra</div>
                    <div className="font-mono text-sm">
                      R$ {transaction.buyPrice.toFixed(4)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Venda</div>
                    <div className="font-mono text-sm">
                      R$ {transaction.sellPrice.toFixed(4)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Quantidade</div>
                    <div className="font-mono text-sm">
                      {transaction.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Lucro Bruto</div>
                    <div className="font-medium text-green-600">
                      R$ {transaction.profit.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Taxas</div>
                    <div className="font-medium text-red-600">
                      R$ {transaction.fees.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Lucro Líquido</div>
                    <div className={`font-bold ${transaction.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {transaction.netProfit.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

