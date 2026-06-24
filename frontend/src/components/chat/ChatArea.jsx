import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { ChatAreaHeader } from "./ChatAreaHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/10">
        <MessageSquare className="size-8 text-accent" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">No conversation selected</h3>
        <p className="mt-1 text-sm text-[#8E8E93] dark:text-[#636366]">
          Pick a chat from the sidebar to start messaging
        </p>
      </div>
    </div>
  );
}

export function ChatArea() {
  const selectedUser = useChatStore((s) => s.selectedUser);

  if (!selectedUser) {
    return (
      <section className="hidden flex-1 flex-col md:flex">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col">
      <ChatAreaHeader />
      <MessageList />
      <MessageInput />
    </section>
  );
}
