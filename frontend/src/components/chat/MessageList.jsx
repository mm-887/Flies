import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime } from "../../lib/utils";

function MessageBubble({ message, isMine }) {
  const bubbleBase = [
    "msg-bubble relative max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
    "break-words",
  ];

  const mineStyle = [
    ...bubbleBase,
    "self-end rounded-br-md bg-accent text-accent-foreground",
  ].join(" ");

  const theirStyle = [
    ...bubbleBase,
    "self-start rounded-bl-md bg-white/80 text-zinc-900 dark:bg-[#2C2C2E] dark:text-white",
  ].join(" ");

  return (
    <div className={isMine ? "flex justify-end" : "flex justify-start"}>
      <div className={isMine ? mineStyle : theirStyle}>
        {message.image && (
          <img
            src={message.image}
            alt=""
            className="mb-1.5 max-h-60 w-full rounded-xl object-cover"
            loading="lazy"
          />
        )}
        {message.video && (
          <video
            src={message.video}
            controls
            className="mb-1.5 max-h-60 w-full rounded-xl"
          />
        )}
        {message.text && <p>{message.text}</p>}
        <p
          className={[
            "mt-1 text-right text-[10px]",
            isMine ? "text-accent-foreground/60" : "text-zinc-500 dark:text-zinc-400",
          ].join(" ")}
        >
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function MessageList() {
  const { messages, isLoadingMessages, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const authUser = useAuthStore((s) => s.authUser);
  const bottomRef = useRef(null);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm text-[#8E8E93] dark:text-[#636366]">
          No messages yet. Say hello! 👋
        </p>
      </div>
    );
  }

  return (
    <div className="chat-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isMine={msg.senderId === authUser?._id}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
