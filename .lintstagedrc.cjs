module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "yarn biome check --write --no-errors-on-unmatched",
    "yarn vitest related --run",
  ],
  "*.{json,jsonc}": ["yarn biome check --write --no-errors-on-unmatched"],
  "*.{css,scss,less}": ["yarn biome check --write --no-errors-on-unmatched"],
  "*.{md,mdx}": ["yarn biome check --write --no-errors-on-unmatched"],
};
