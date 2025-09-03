# Capra Fagradar

## Getting up and running

This project uses [pnpm](https://pnpm.io/) with workspaces. Install `pnpm` through `corepack` (included with NodeJS v16.13+) with the following command:

```
corepack enable pnpm
```

Then install all dependencies with.

```
pnpm install
```

And start the development server with

```
cd capra-fagradar
pnpm dev
```

## Updating contents

Content is found in two folders;

- `src/technical-radar`
- `src/tech-leader-radar`

The files themselves are .mdx files, using .yaml frontmatter for configuration.
These are the config values:

- `id`: unused
- `name`: what it says on the tin
- `depth`: 1-4. See `src/om-fagradar.mdx` for info on the depth levels
- `qudrant`: which named quadrant to put this item in. Quadrant names are set in `index.tsx` for both radars (`const quadrants = [...]`)

Editing can be done in two ways:

1. Using an IDE
1. Using [Obsidian](https://obsidian.md/)

If you have not heard of Obsidian before, you can read about them [here](https://obsidian.md/about)

### How to actually update the contents

#### With an IDE

Requirements: IDE installed, git configured

1. Clone the repo
2. Open it with your IDE
3. Do the changes in the most likely very mediocre markdown editor
4. Commit using your preferred git tool

#### With Obsidian

Requirements: Obsidian installed, git configured

1. Clone the repo
2. Open `src/` as a vault in Obsidian
3. Do the changes with a kick-ass editor
4. Commit using your preferred git tool

To be able to edit the .mdx files you need to install the Obsidian community plugin "mdx as md".  
Obsidian also has a very popular Git plugin, if you don't want to do git on the outside.
