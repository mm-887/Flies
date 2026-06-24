import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-default bg-surface p-1 shadow-sm">
      <Button
        size="sm"
        color={theme === "light" ? "primary" : "default"}
        variant={theme === "light" ? "solid" : "ghost"}
        isIconOnly
        onPress={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>
      <Button
        size="sm"
        color={theme === "dark" ? "primary" : "default"}
        variant={theme === "dark" ? "solid" : "ghost"}
        isIconOnly
        onPress={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>
    </div>
  );
}