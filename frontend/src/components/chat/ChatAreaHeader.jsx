import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

export function ChatAreaHeader() {
  const { selectedUser, selectUser } = useChatStore();
  const onlineUsers = useAuthStore((s) => s.onlineUsers);

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-black/8 bg-[#F6F6F6]/80 px-4 py-2.5 backdrop-blur-sm dark:border-white/8 dark:bg-[#1C1C1E]/80">
      <div className="relative shrink-0">
        <img
          src={selectedUser.profilePicture || "/avatar.png"}
          alt=""
          className="size-9 rounded-full object-cover"
          draggable={false}
        />
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#F6F6F6] bg-[#34C759] dark:border-[#1C1C1E]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{selectedUser.username}</p>
        <p className={["text-[11px] font-medium", isOnline ? "text-[#34C759]" : "text-[#8E8E93] dark:text-[#636366]"].join(" ")}>
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => selectUser(null)}
        className="rounded-lg p-1.5 text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-foreground dark:text-[#636366] dark:hover:bg-white/5"
        aria-label="Close chat"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
