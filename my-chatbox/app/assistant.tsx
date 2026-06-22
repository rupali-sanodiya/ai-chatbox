
"use client";

import { useMemo, useState } from "react"; 
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import Thread from "@/components/thread";
import { ProfileComponent } from "@/components/profile"; 
import { SettingsComponent } from "@/components/setting"; // Sahi file name (plural)
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";

export const Assistant = () => {
  // Current View State
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'settings'>('chat');

  const runtime = useChatRuntime({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: new AssistantChatTransport({
      api: "/api/chat",
    }),
  });

  const runtimeWithGreeting = useMemo(() => {
    return {
      ...runtime,
      initialMessages: [
        {
          id: "welcome-msg",
          role: "assistant",
          content: "Hello Rupali! How can I help you today?",
        },
      ],
    };
  }, [runtime]);

  return (
    <AssistantRuntimeProvider runtime={runtimeWithGreeting as any}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          {/* Sidebar navigation */}
          <ThreadListSidebar onNavigate={setCurrentView} />
          
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-medium capitalize">{currentView}</span>
            </header>
            
            <div className="flex-1 overflow-hidden h-[calc(100vh-64px)]">
              {/* Dynamic View Switcher */}
              {currentView === 'chat' && <Thread />}
              {currentView === 'profile' && <ProfileComponent />}
              {currentView === 'settings' && <SettingsComponent />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};


