import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Wallet, 
  MessageSquare, 
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Monitor', href: '/monitor', icon: Activity },
  { name: 'Exchanges', href: '/exchanges', icon: Wallet },
  { name: 'Transações', href: '/transactions', icon: TrendingUp },
  { name: 'Telegram', href: '/telegram', icon: MessageSquare },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar({ open, setOpen }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
        open ? "w-64" : "w-16",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {open && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ArbitrageBot
              </span>
            </div>
          )}
          
          {!open && (
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  !open && "justify-center"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0 w-5 h-5",
                  open && "mr-3"
                )} />
                {open && (
                  <span className="truncate">{item.name}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!open && (
                  <div className="absolute left-16 px-2 py-1 ml-2 text-sm bg-popover text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Toggle button */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
            className={cn(
              "w-full",
              !open && "px-2"
            )}
          >
            {open ? (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Recolher
              </>
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

