import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw,
  Shield,
  Zap,
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Settings() {
  const [settings, setSettings] = useState({
    // Arbitrage Settings
    minSpreadPercentage: 0.2,
    maxSpreadPercentage: 5.0,
    monitorInterval: 5,
    maxOrderAmount: 1000,
    autoExecution: false,
    
    // Risk Management
    maxDailyLoss: 100,
    maxPositionSize: 5000,
    stopLossEnabled: true,
    
    // Trading Pairs
    tradingPairs: ['USDT/BRL'],
    
    // Notifications
    soundAlerts: true,
    emailNotifications: false,
    
    // Advanced
    apiTimeout: 30,
    retryAttempts: 3,
    logLevel: 'info'
  })

  const handleSave = () => {
    // Simular salvamento das configurações
    console.log('Salvando configurações:', settings)
  }

  const handleReset = () => {
    // Reset para configurações padrão
    setSettings({
      minSpreadPercentage: 0.2,
      maxSpreadPercentage: 5.0,
      monitorInterval: 5,
      maxOrderAmount: 1000,
      autoExecution: false,
      maxDailyLoss: 100,
      maxPositionSize: 5000,
      stopLossEnabled: true,
      tradingPairs: ['USDT/BRL'],
      soundAlerts: true,
      emailNotifications: false,
      apiTimeout: 30,
      retryAttempts: 3,
      logLevel: 'info'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Ajuste os parâmetros do sistema de arbitragem
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Padrões
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      {/* Arbitrage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Configurações de Arbitragem</span>
          </CardTitle>
          <CardDescription>
            Parâmetros para detecção e execução de oportunidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Spread Mínimo (%)</Label>
              <div className="px-3">
                <Slider
                  value={[settings.minSpreadPercentage]}
                  onValueChange={(value) => setSettings({...settings, minSpreadPercentage: value[0]})}
                  max={2}
                  min={0.1}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0.1%</span>
                  <span className="font-medium">{settings.minSpreadPercentage.toFixed(2)}%</span>
                  <span>2.0%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Spread Máximo (%)</Label>
              <div className="px-3">
                <Slider
                  value={[settings.maxSpreadPercentage]}
                  onValueChange={(value) => setSettings({...settings, maxSpreadPercentage: value[0]})}
                  max={10}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1%</span>
                  <span className="font-medium">{settings.maxSpreadPercentage.toFixed(1)}%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitor-interval">Intervalo de Monitoramento (segundos)</Label>
              <Input
                id="monitor-interval"
                type="number"
                min="1"
                max="60"
                value={settings.monitorInterval}
                onChange={(e) => setSettings({...settings, monitorInterval: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-order">Quantidade Máxima por Ordem</Label>
              <Input
                id="max-order"
                type="number"
                min="100"
                max="10000"
                value={settings.maxOrderAmount}
                onChange={(e) => setSettings({...settings, maxOrderAmount: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-execution"
              checked={settings.autoExecution}
              onCheckedChange={(checked) => setSettings({...settings, autoExecution: checked})}
            />
            <Label htmlFor="auto-execution">Execução Automática de Oportunidades</Label>
          </div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Gerenciamento de Risco</span>
          </CardTitle>
          <CardDescription>
            Configurações para limitar perdas e controlar exposição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="max-daily-loss">Perda Máxima Diária (R$)</Label>
              <Input
                id="max-daily-loss"
                type="number"
                min="0"
                value={settings.maxDailyLoss}
                onChange={(e) => setSettings({...settings, maxDailyLoss: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-position">Tamanho Máximo da Posição (R$)</Label>
              <Input
                id="max-position"
                type="number"
                min="100"
                value={settings.maxPositionSize}
                onChange={(e) => setSettings({...settings, maxPositionSize: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="stop-loss"
              checked={settings.stopLossEnabled}
              onCheckedChange={(checked) => setSettings({...settings, stopLossEnabled: checked})}
            />
            <Label htmlFor="stop-loss">Ativar Stop Loss Automático</Label>
          </div>
        </CardContent>
      </Card>

      {/* Trading Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Pares de Negociação</span>
          </CardTitle>
          <CardDescription>
            Selecione os pares de moedas para monitoramento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Pares Ativos</Label>
              <div className="space-y-2">
                {settings.tradingPairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                    <span className="font-medium">{pair}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newPairs = settings.tradingPairs.filter((_, i) => i !== index)
                        setSettings({...settings, tradingPairs: newPairs})
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adicionar Novo Par</Label>
              <Select onValueChange={(value) => {
                if (!settings.tradingPairs.includes(value)) {
                  setSettings({...settings, tradingPairs: [...settings.tradingPairs, value]})
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT/BRL">USDT/BRL</SelectItem>
                  <SelectItem value="BTC/BRL">BTC/BRL</SelectItem>
                  <SelectItem value="ETH/BRL">ETH/BRL</SelectItem>
                  <SelectItem value="USDC/BRL">USDC/BRL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Notificações</span>
          </CardTitle>
          <CardDescription>
            Configure como receber alertas e notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Alertas Sonoros</Label>
                <p className="text-sm text-muted-foreground">
                  Reproduzir som quando oportunidades forem detectadas
                </p>
              </div>
              <Switch
                checked={settings.soundAlerts}
                onCheckedChange={(checked) => setSettings({...settings, soundAlerts: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar resumos e alertas por email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Configurações Avançadas</span>
          </CardTitle>
          <CardDescription>
            Configurações técnicas para usuários avançados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="api-timeout">Timeout da API (segundos)</Label>
              <Input
                id="api-timeout"
                type="number"
                min="5"
                max="120"
                value={settings.apiTimeout}
                onChange={(e) => setSettings({...settings, apiTimeout: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retry-attempts">Tentativas de Retry</Label>
              <Input
                id="retry-attempts"
                type="number"
                min="1"
                max="10"
                value={settings.retryAttempts}
                onChange={(e) => setSettings({...settings, retryAttempts: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label>Nível de Log</Label>
              <Select 
                value={settings.logLevel} 
                onValueChange={(value) => setSettings({...settings, logLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

