import { useWallpaper } from "../context/wallpaper";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { ChatArea } from "../components/chat/ChatArea";
import { useChatStore } from "../store/useChatStore";

function ChatPage() {
  const { frameStyle } = useWallpaper();
  const selectedUser = useChatStore((s) => s.selectedUser);

  return (
    <div className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8" style={frameStyle}>
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground">
        <ChatHeader />

        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Sidebar — hidden on mobile when a chat is open */}
          <div className={selectedUser ? "hidden md:flex" : "flex"}>
            <ChatSidebar />
          </div>

          {/* Chat area — shown on mobile only when a chat is selected */}
          <div className={[
            "flex flex-1 flex-col",
            selectedUser ? "flex" : "hidden md:flex",
          ].join(" ")}>
            <ChatArea />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatPage;
