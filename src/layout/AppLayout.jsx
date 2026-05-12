import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useIsMobile } from '../hooks/useMediaQuery'

export default function AppLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => { setSidebarOpen(false) }, [pathname, isMobile])

  const showSidebarInline = !isHome && !isMobile
  const showSidebarDrawer = !isHome && isMobile

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Animated background orbs */}
      <div className="bg-orbs">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <TopBar
        showMenuButton={!isHome && isMobile}
        onMenuClick={() => setSidebarOpen(o => !o)}
        sidebarCollapsed={sidebarCollapsed && !isMobile && showSidebarInline}
        onToggleSidebarCollapse={!isMobile && showSidebarInline ? () => setSidebarCollapsed(o => !o) : null}
      />

      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
        {showSidebarInline && (
          <div style={{
            transition: 'all 0.3s ease',
            width: sidebarCollapsed ? 0 : 248,
            overflow: 'hidden',
                     height: '100%',
          }}>
            <Sidebar />
          </div>
        )}
        {showSidebarDrawer && (
          <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: 'transparent',
        }}>
          <div
            className={isHome ? 'page-container page-home' : 'page-container page-algo'}
            style={{
              maxWidth: isHome ? 1180 : 'none',
              margin: '0 auto',
              animation: 'fadeIn 0.4s ease-out',
              width: '100%',
              paddingLeft: isHome ? 0 : 16,
              paddingRight: isHome ? 0 : 16,
            }}>
            <Outlet context={{ sidebarCollapsed }} />
          </div>
        </main>
      </div>
    </div>
  )
}
