import { UserButton } from "@clerk/react";
import { APP_NAME, AppLogo } from "../AppLogo";
import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-black/10 bg-[#F6F6F6]/95 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-[#1C1C1E]/95">
      <div className="flex flex-1 items-center gap-2.5 px-1">
        <AppLogo size={30} className="rounded-[7px]" alt="" />

        <div>
          <p className="truncate text-[15px] font-semibold leading-tight">{APP_NAME}</p>
          <p className="truncate text-xs text-[#8E8E93] dark:text-[#98989D]">Messaging</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <WallpaperPicker />
        <ThemePresetPicker />
        <ThemeToggle />

        <div className="ml-1.5 flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8 ring-2 ring-accent/30 ring-offset-1 ring-offset-transparent",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
