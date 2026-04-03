import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^:([a-z_]+):\s+(?:(\w+)(?:\([^)]*\))?:\s+)?(.*)$/,
      headerCorrespondence: ["gitmoji", "type", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // :sparkles: New feature
        "fix", // :bug: Bug fix
        "docs", // :docs: Documentation changes
        "style", // :art: Code style changes (formatting, etc)
        "refactor", // :hammer: Refactoring
        "perf", // :zap: Performance improvements
        "test", // :white_check_mark: Adding or updating tests
        "build", // :construction: Build system or dependencies
        "ci", // :green_heart: CI configuration
        "chore", // :wrench: Maintenance tasks
        "revert", // :rewind: Reverting changes
      ],
    ],
    "subject-case": [0], // Disable subject case check for gitmoji commits
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
  },
  plugins: [
    {
      rules: {
        "gitmoji-required": (parsed: any) => {
          if (!parsed.header) return [false, "Commit header is required"];

          const gitmojiMatch = parsed.header.match(/^:([^:]+):/);
          if (!gitmojiMatch) {
            return [
              false,
              "Commit message must start with a gitmoji emoji (e.g., :sparkles:, :bug:, :docs:)",
            ];
          }

          const gitmoji = gitmojiMatch[1];
          const validGitmojis = [
            "sparkles",
            "bug",
            "docs",
            "art",
            "hammer",
            "zap",
            "white_check_mark",
            "construction",
            "green_heart",
            "wrench",
            "rewind",
          ];

          if (!validGitmojis.includes(gitmoji)) {
            return [
              false,
              `Invalid gitmoji. Must be one of: ${validGitmojis.map((g) => `:${g}:`).join(", ")}`,
            ];
          }

          return [true];
        },
        "gitmoji-type-mapping": (parsed: any) => {
          if (!parsed.header) return [false, "Commit header is required"];

          const gitmojiMatch = parsed.header.match(/^:([^:]+):\s+(\w+)/);
          if (!gitmojiMatch) return [true]; // Skip if pattern doesn't match

          const gitmoji = gitmojiMatch[1];
          const type = gitmojiMatch[2];

          const gitmojiTypeMap: Record<string, string> = {
            sparkles: "feat",
            bug: "fix",
            docs: "docs",
            art: "style",
            hammer: "refactor",
            zap: "perf",
            white_check_mark: "test",
            construction: "build",
            green_heart: "ci",
            wrench: "chore",
            rewind: "revert",
          };

          const expectedType = gitmojiTypeMap[gitmoji];
          if (expectedType && expectedType !== type) {
            return [
              false,
              `Gitmoji :${gitmoji}: should be used with type "${expectedType}", but found "${type}"`,
            ];
          }

          return [true];
        },
      },
    },
  ],
  defaultRules: {
    "gitmoji-required": 2,
    "gitmoji-type-mapping": 2,
  },
};

export default config;
