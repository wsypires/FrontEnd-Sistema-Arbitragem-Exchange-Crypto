import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { Dashboard } from '@/components/Dashboard'
import { ExchangeConfig } from '@/components/ExchangeConfig'
import { ArbitrageMonitor } from '@/components/ArbitrageMonitor'
import { TransactionHistory } from '@/components/TransactionHistory'
import { TelegramConfig } from '@/components/TelegramConfig'
import { Settings } from '@/components/Settings'
import { ThemeProvider } from '@/components/ThemeProvider'
import { WebSocketProvider } from '@/contexts/WebSocketContext'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Verificar preferência de tema salva
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <WebSocketProvider>
        <Router>
          <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            
            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
              {/* Header */}
              <Header 
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
              />
              
              {/* Page Content */}
              <main className="p-4 lg:p-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/exchanges" element={<ExchangeConfig />} />
                  <Route path="/monitor" element={<ArbitrageMonitor />} />
                  <Route path="/transactions" element={<TransactionHistory />} />
                  <Route path="/telegram" element={<TelegramConfig />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </WebSocketProvider>
    </ThemeProvider>
  )
}

export default App

