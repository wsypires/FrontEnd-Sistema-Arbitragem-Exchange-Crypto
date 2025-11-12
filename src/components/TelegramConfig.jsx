import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle,
  Bot,
  Users,
  Settings,
  Bell
} from 'lucide-react'

export function TelegramConfig() {
  const [config, setConfig] = useState({
    botToken: '',
    chatId: '',
    isActive: false,
    connected: false
  })

  const [notifications, setNotifications] = useState({
    opportunities: true,
    executions: true,
    errors: true,
    dailySummary: true
  })

  const [testMessage, setTestMessage] = useState('')

  const handleSaveConfig = () => {
    // Simular salvamento
    setConfig({...config, connected: true})
  }

  const handleTestConnection = () => {
    // Simular teste de conexão
    setConfig({...config, connected: !config.connected})
  }

  const handleSendTestMessage = () => {
    // Simular envio de mensagem de teste
    console.log('Enviando mensagem de teste:', testMessage)
    setTestMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração do Telegram</h1>
          <p className="text-muted-foreground">
            Configure alertas e notificações via Telegram
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant={config.connected ? "default" : "destructive"}>
            {config.connected ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Conectado
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Desconectado
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Bot Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Configuração do Bot</span>
          </CardTitle>
          <CardDescription>
            Configure as credenciais do seu bot do Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Token do Bot</Label>
            <Input
              id="bot-token"
              type="password"
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={config.botToken}
              onChange={(e) => setConfig({...config, botToken: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              Obtenha o token criando um bot com o @BotFather no Telegram
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-id">ID do Chat</Label>
            <Input
              id="chat-id"
              placeholder="-1001234567890"
              value={config.chatId}
              onChange={(e) => setConfig({...config, chatId: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              ID do chat ou grupo onde as mensagens serão enviadas
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="telegram-active"
              checked={config.isActive}
              onCheckedChange={(checked) => setConfig({...config, isActive: checked})}
            />
            <Label htmlFor="telegram-active">Ativar notificações do Telegram</Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSaveConfig} className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Salvar Configuração
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!config.botToken || !config.chatId}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Testar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Configurações de Notificação</span>
          </CardTitle>
          <CardDescription>
            Escolha quais eventos devem gerar notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Oportunidades Detectadas</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar quando uma nova oportunidade de arbitragem for detectada
                </p>
              </div>
              <Switch
                checked={notifications.opportunities}
                onCheckedChange={(checked) => setNotifications({...notifications, opportunities: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Execuções de Arbitragem</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar sobre o resultado das execuções de arbitragem
                </p>
              </div>
              <Switch
                checked={notifications.executions}
                onCheckedChange={(checked) => setNotifications({...notifications, executions: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Erros e Alertas</Label>
                <p className="text-sm text-muted-foreground">
                  Notificar sobre erros de conexão e outros problemas
                </p>
              </div>
              <Switch
                checked={notifications.errors}
                onCheckedChange={(checked) => setNotifications({...notifications, errors: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Resumo Diário</Label>
                <p className="text-sm text-muted-foreground">
                  Enviar resumo diário com estatísticas de performance
                </p>
              </div>
              <Switch
                checked={notifications.dailySummary}
                onCheckedChange={(checked) => setNotifications({...notifications, dailySummary: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Enviar Mensagem de Teste</span>
          </CardTitle>
          <CardDescription>
            Teste a configuração enviando uma mensagem personalizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-message">Mensagem</Label>
            <Textarea
              id="test-message"
              placeholder="Digite sua mensagem de teste aqui..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleSendTestMessage}
            disabled={!testMessage || !config.connected}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensagem de Teste
          </Button>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como Configurar</CardTitle>
          <CardDescription>
            Siga estes passos para configurar as notificações do Telegram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Criar um Bot</h4>
                <p className="text-sm text-muted-foreground">
                  Abra o Telegram e procure por @BotFather. Envie /newbot e siga as instruções para criar seu bot.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Obter o Token</h4>
                <p className="text-sm text-muted-foreground">
                  O @BotFather fornecerá um token único para seu bot. Cole este token no campo "Token do Bot" acima.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Obter o Chat ID</h4>
                <p className="text-sm text-muted-foreground">
                  Adicione seu bot a um chat ou grupo e envie uma mensagem. Use @userinfobot para obter o Chat ID.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-medium">Testar a Configuração</h4>
                <p className="text-sm text-muted-foreground">
                  Preencha os campos acima e clique em "Testar Conexão" para verificar se tudo está funcionando.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

