import { createElement } from 'react';
import { Radar, type Blip, type Quadrant } from '../radar';
import type { ModuleNamespace } from 'vite/types/hot.js';

// Dynamically import all mdx files in current dir
const modules = import.meta.glob('./**/*.mdx', { eager: true }) as ModuleNamespace;
const logos = import.meta.glob('./**/*.png', { eager: true }) as Record<string, { default: string }>;
const unsortedBlips: Blip[] = [];

let blipNumber = 1

for (const modulePath in modules) {
  const frontmatter = modules[modulePath]?.frontmatter;
  const defaultExport = modules[modulePath]?.default;
  const logo = logos[modulePath.replace('.mdx', '.png')]?.default;
  const Empty = () => { return <div>Empty</div> };

  unsortedBlips.push({
    ...frontmatter,
    logo,
    element: createElement(defaultExport || Empty),
  });
};

const quadrants = ['backend', 'frontend', 'software_engineering', 'plattform']

const blips = unsortedBlips.sort((a, b) =>
  (a.depth || 0) - (b.depth || 0))
  .filter(b => quadrants.includes(b.quadrant)).map((blip) => ({
    ...blip,
    blipNumber: blipNumber++
  }));



export const TechnicalRadar = () => {
  const quadrants = [
    {
      name: "backend",
      orientation: "top-left",
      blipColor: "#47A1AD",
      blips: [
        ...(blips.filter(item => item.quadrant === 'backend')),
      ],
    },
    {
      name: "frontend",
      orientation: "top-right",
      blipColor: "#6A9D77",
      blips: [
        ...(blips.filter(item => item.quadrant === 'frontend')),
      ],
    },
    {
      name: "software engineering",
      orientation: "bottom-left",
      blipColor: "#CC8508",
      blips: [
        ...(blips.filter(item => item.quadrant === 'software_engineering')),
      ],
    },
    {
      name: "plattform",
      orientation: "bottom-right",
      blipColor: "#DE6879",
      blips: [
        ...(blips.filter(item => item.quadrant === 'plattform')),
      ],
    },
  ] satisfies [Quadrant, Quadrant, Quadrant, Quadrant];

  return (
    <div>
      <h1> Teknisk radar </h1>
      <Radar type="technical" quadrants={quadrants} />
    </div>
  );
};
