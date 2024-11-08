import { Colors } from "@blueprintjs/core";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        muted: Colors.GRAY1,
      },
    },
  },
  plugins: [],
} satisfies Config;
