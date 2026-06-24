import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";

export function MessageInput() {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreview({ url, type: file.type });
  };

  const clearMedia = () => {
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaFile) return;

    await sendMessage(text.trim(), mediaFile);
    setText("");
    clearMedia();
  };

  return (
    <div className="shrink-0 border-t border-black/8 bg-[#F6F6F6]/80 backdrop-blur-sm dark:border-white/8 dark:bg-[#1C1C1E]/80">
      {/* Media preview */}
      {mediaPreview && (
        <div className="relative mx-4 mt-3 inline-block">
          {mediaPreview.type.startsWith("video/") ? (
            <video
              src={mediaPreview.url}
              className="h-24 rounded-xl border border-black/10 object-cover dark:border-white/10"
            />
          ) : (
            <img
              src={mediaPreview.url}
              alt="Preview"
              className="h-24 rounded-xl border border-black/10 object-cover dark:border-white/10"
            />
          )}
          <button
            type="button"
            onClick={clearMedia}
            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-zinc-800 text-white shadow-md hover:bg-zinc-700"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 px-3 py-2.5">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-lg p-2 text-[#8E8E93] transition-colors hover:bg-black/5 hover:text-foreground dark:text-[#636366] dark:hover:bg-white/5"
          aria-label="Attach media"
        >
          <ImagePlus className="size-5" />
        </button>

        <input
          type="text"
          placeholder="Message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-w-0 flex-1 rounded-2xl border border-black/8 bg-white/70 px-4 py-2 text-sm text-foreground placeholder:text-[#8E8E93] focus:border-accent focus:outline-none dark:border-white/10 dark:bg-black/30 dark:placeholder:text-[#636366]"
        />

        <button
          type="submit"
          disabled={isSendingMessage || (!text.trim() && !mediaFile)}
          className="shrink-0 rounded-xl bg-accent p-2 text-accent-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
          aria-label="Send message"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
}
