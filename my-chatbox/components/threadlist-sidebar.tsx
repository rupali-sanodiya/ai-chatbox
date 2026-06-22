
"use client";

import * as React from "react";
import { Plus, MessagesSquare, Settings, User, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThreadList } from "@/components/thread-list";

// Props define karein taaki hum nav handle kar sakein
interface Props extends React.ComponentProps<typeof Sidebar> {
  onNavigate: (view: 'chat' | 'profile' | 'settings') => void;
}

export function ThreadListSidebar({ onNavigate, ...props }: Props) {
  return (
    <Sidebar {...props} className="border-r border-slate-200 bg-slate-50/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-6 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200"
              onClick={() => onNavigate('chat')}
            >
              <Plus size={20} />
              <span className="font-semibold">New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Recent Conversations
        </div>
        <ThreadList />
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onNavigate('profile')} className="flex items-center gap-3 rounded-lg p-2 text-slate-600 hover:bg-slate-200">
              <User size={18} />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onNavigate('settings')} className="flex items-center gap-3 rounded-lg p-2 text-slate-600 hover:bg-slate-200">
              <Settings size={18} />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}