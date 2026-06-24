import { useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const TAB_CHATS = "chats";
const TAB_USERS = "users";

function OnlineIndicator({ online }) {
  if (!online) return null;
  return (
    <span className="absolute -bottom-0.5 -right-0.5 z-10 size-3 rounded-full border-2 border-[#F6F6F6] bg-[#34C759] dark:border-[#1C1C1E]" />
  );
}

function UserRow({ user, selected, online, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        selected
          ? "bg-accent/15 dark:bg-accent/20"
          : "hover:bg-black/5 dark:hover:bg-white/5",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt=""
          className="size-10 rounded-full object-cover"
          draggable={false}
        />
        <OnlineIndicator online={online} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate text-sm font-semibold",
            selected ? "text-accent" : "text-foreground",
          ].join(" ")}
        >
          {user.username}
        </p>
        {online && (
          <p className="text-[11px] text-[#34C759]">Online</p>
        )}
      </div>
    </button>
  );
}

export function ChatSidebar() {
  const [tab, setTab] = useState(TAB_CHATS);
  const [search, setSearch] = useState("");

  const { conversations, users, selectedUser, selectUser, loadConversations, loadUsers, isLoadingConversations, isLoadingUsers } = useChatStore();
  const onlineUsers = useAuthStore((s) => s.onlineUsers);

  useEffect(() => {
    loadConversations();
    loadUsers();
  }, [loadConversations, loadUsers]);

  const onlineSet = useMemo(() => new Set(onlineUsers), [onlineUsers]);

  const displayList = tab === TAB_CHATS ? conversations : users;

  const filtered = useMemo(() => {
    if (!search.trim()) return displayList;
    const q = search.toLowerCase();
    return displayList.filter((u) => u.username?.toLowerCase().includes(q));
  }, [displayList, search]);

  const isLoading = tab === TAB_CHATS ? isLoadingConversations : isLoadingUsers;

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-black/8 bg-[#F6F6F6]/60 backdrop-blur-sm dark:border-white/8 dark:bg-[#1C1C1E]/60 md:w-72 lg:w-80">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-black/6 px-3 py-2 dark:border-white/6">
        <button
          type="button"
          onClick={() => setTab(TAB_CHATS)}
          className={[
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            tab === TAB_CHATS
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-[#8E8E93] hover:text-foreground dark:text-[#98989D]",
          ].join(" ")}
        >
          <MessageSquare className="size-3.5" />
          Chats
        </button>
        <button
          type="button"
          onClick={() => setTab(TAB_USERS)}
          className={[
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            tab === TAB_USERS
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-[#8E8E93] hover:text-foreground dark:text-[#98989D]",
          ].join(" ")}
        >
          <Users className="size-3.5" />
          Users
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#8E8E93] dark:text-[#636366]" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-black/8 bg-white/70 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-[#8E8E93] focus:border-accent focus:outline-none dark:border-white/10 dark:bg-black/30 dark:placeholder:text-[#636366]"
          />
        </div>
      </div>

      {/* List */}
      <div className="chat-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <span className="size-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-xs text-[#8E8E93] dark:text-[#636366]">
            {search.trim() ? "No results" : tab === TAB_CHATS ? "No conversations yet" : "No users found"}
          </p>
        ) : (
          filtered.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              selected={selectedUser?._id === user._id}
              online={onlineSet.has(user._id)}
              onSelect={selectUser}
            />
          ))
        )}
      </div>
    </aside>
  );
}
