import { defineConfig } from "cz-git";

const config = defineConfig({
  extends: ["gitmoji"],
  rules: {
    "header-max-length": [2, "always", 100],
  },
  prompt: {
    // Enable Gitmoji in the cz-git prompt
    useEmoji: true,
    emojiAlign: "left",
  },
});

export default config;
