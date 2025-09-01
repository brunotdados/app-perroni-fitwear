import { Package, LogOut, Dumbbell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Cadastro de Produtos",
    url: "/produtos",
    icon: Package,
  },
];

interface AppSidebarProps {
  onLogout?: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-primary"
      : "text-foreground hover:bg-muted/50 transition-colors";


  return (
    <Sidebar collapsible="none" className="w-64 bg-background text-foreground border-r">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
            <Dumbbell className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                Perroni
              </h2>
              <p className="text-xs text-muted-foreground">Fitwear Manager</p>
            </div>
          )}
        </div>
        <SidebarTrigger className="mx-3 mb-2" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {!isCollapsed && "Sair"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}