import { writeFileSync, mkdirSync } from "node:fs";
import { buildThemeCss } from "@noahwright/design";
import { theme } from "../theme";

mkdirSync("public", { recursive: true });
writeFileSync("public/theme.css", buildThemeCss(theme), "utf8");
