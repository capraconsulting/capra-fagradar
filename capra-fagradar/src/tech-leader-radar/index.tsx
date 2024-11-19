import { createElement } from 'react';
import { type Blip, Radar, type Quadrant } from '../radar';
import type { ModuleNamespace } from 'vite/types/hot.js';

// Dynamically import all mdx files in current dir
const modules = import.meta.glob('./**/*.mdx', {
  eager: true,
}) as ModuleNamespace;
const unsortedBlips: Blip[] = [];

let blipNumber = 1;

for (const modulePath in modules) {
  const frontmatter = modules[modulePath]?.frontmatter;
  const defaultExport = modules[modulePath]?.default;
  const Empty = () => {
    return <div>Empty</div>;
  };

  unsortedBlips.push({
    ...frontmatter,
    element: createElement(defaultExport || Empty),
  });
}

const quadrants = ['Organisasjon', 'Prosess', 'Folk', 'Teknologi'];

const blips = unsortedBlips
  .sort((a, b) => (a.depth || 0) - (b.depth || 0))
  .filter((b) => quadrants.includes(b.quadrant))
  .map((blip) => ({
    ...blip,
    blipNumber: blipNumber++,
  }));

export const TechLeaderRadar = () => {
  const quadrants = [
    {
      name: 'Organisasjon',
      orientation: 'top-left',
      blipColor: '#47A1AD',
      blips: [...blips.filter((item) => item.quadrant === 'Organisasjon')],
    },
    {
      name: 'Teknologi',
      orientation: 'top-right',
      blipColor: '#6B9E78',
      blips: [...blips.filter((item) => item.quadrant === 'Teknologi')],
    },
    {
      name: 'Folk',
      orientation: 'bottom-left',
      blipColor: '#CC8508',
      blips: [...blips.filter((item) => item.quadrant === 'Folk')],
    },
    {
      name: 'Prosess eller arbeid?',
      orientation: 'bottom-right',
      blipColor: '#E16A7B',
      blips: [...blips.filter((item) => item.quadrant === 'Prosess')],
    },
  ] satisfies [Quadrant, Quadrant, Quadrant, Quadrant];

  return (
    <div>
      <h1>Teknologiledelse radar</h1>
      <Radar type="tech-lead" quadrants={quadrants} />
    </div>
  );
};
