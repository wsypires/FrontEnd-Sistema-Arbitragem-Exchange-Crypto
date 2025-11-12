import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff,
  Circle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header({ sidebarOpen, setSidebarOpen, darkMode, toggleTheme }) {
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [notifications, setNotifications] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Atualizar relógio a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simular status de conexão
    const checkConnection = () => {
      // Aqui você implementaria a verificação real da conexão
      setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected')
    }

    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)
    checkConnection()

    return () => {
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {connectionStatus === 'connected' ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Offline</span>
              </div>
            )}
          </div>

          {/* Market Status */}
          <div className="hidden md:flex items-center space-x-2">
            <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">Mercado Ativo</span>
          </div>
        </div>

        {/* Center - Time and Date */}
        <div className="hidden lg:flex flex-col items-center">
          <div className="text-lg font-mono font-bold">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.length === 0 ? (
                <DropdownMenuItem disabled>
                  Nenhuma notificação
                </DropdownMenuItem>
              ) : (
                notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>
                    {notification.message}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Status Indicators */}
          <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-border">
            <div className="flex items-center space-x-1">
              <Circle className="w-2 h-2 fill-green-500 text-green-500" />
              <span className="text-xs text-muted-foreground">API</span>
            </div>
            <div className="flex items-center space-x-1">
              <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
              <span className="text-xs text-muted-foreground">WS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

