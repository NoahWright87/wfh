import { useEffect, useState } from "react";
import { Button, getThemeMode, toggleThemeMode, type ThemeMode } from "@noahwright/design";

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    setMode(getThemeMode());
  }, []);

  return (
    <Button variant="ghost" size="small" onClick={() => setMode(toggleThemeMode())}>
      <span aria-hidden="true">{mode === "dark" ? "☀️" : "🌙"}</span>
      <span className="sr-only">Toggle light/dark theme</span>
    </Button>
  );
}
