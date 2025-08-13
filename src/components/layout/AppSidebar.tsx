import { 
  BarChart3, 
  ShoppingCart, 
  Plane, 
  FileText, 
  StickyNote, 
  Home,
  Wallet,
  Package,
  TrendingUp,
  Settings,
  Search,
  Bell
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Finanças", url: "/financas", icon: Wallet },
  { title: "Mercado", url: "/mercado", icon: ShoppingCart },
  { title: "Viagens", url: "/viagens", icon: Plane },
  { title: "Documentos", url: "/documentos", icon: FileText },
  { title: "Notas", url: "/notas", icon: StickyNote },
];

const analyticsItems = [
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Projeções", url: "/projecoes", icon: TrendingUp },
  { title: "Estoque", url: "/estoque", icon: Package },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 ${
      isActive 
        ? "bg-primary/20 text-primary border border-primary/30 shadow-glow" 
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
    }`;

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-border/50`}>
      <SidebarContent className="bg-background/95 backdrop-blur-sm">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-foreground">Graphite</h1>
                <p className="text-sm text-muted-foreground">Household Manager</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs font-semibold px-3 py-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs font-semibold px-3 py-2">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-3">
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        <div className="mt-auto p-3 border-t border-border/50">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/configuracoes" className={getNavCls}>
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">Configurações</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}