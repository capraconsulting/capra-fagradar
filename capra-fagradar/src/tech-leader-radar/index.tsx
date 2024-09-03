import { createElement } from 'react';
import { Radar, type Quadrant } from '../radar';

// Dynamically import all mdx files in current dir
const modules = import.meta.glob('./**/*.mdx', { eager: true }) as any;
let items = [];

for (const modulePath in modules) {
  const frontmatter =  modules[modulePath]?.frontmatter;
  const defaultExport = modules[modulePath]?.default;
  const Empty = () => { return <div>Empty</div> };

  items.push({
    ...frontmatter,
		element: createElement(defaultExport || Empty),
  });
};

export const TechLeaderRadar = () => {
	const quadrants = [
		{
			name: "smidig",
			orientation: "top-left",
			blipColor: "rgb(71, 161, 173)",
			blips: [
        ...(items.filter(item => item.quadrant === 'smidig')),
			],
		},
		{
			name: "organisasjon",
			orientation: "top-right",
			blipColor: "rgb(107, 158, 120)",
			blips: [
        ...(items.filter(item => item.quadrant === 'organisasjon')),
			],
		},
		{
			name: "ledelse",
			orientation: "bottom-left",
			blipColor: "rgb(204, 133, 10)",
			blips: [
        ...(items.filter(item => item.quadrant === 'ledelse')),
      ],
		},
		{
			name: "teknisk",
			orientation: "bottom-right",
			blipColor: "rgb(225, 106, 124)",
			blips: [
        ...(items.filter(item => item.quadrant === 'teknisk')),
			],
		},
	] satisfies [Quadrant, Quadrant, Quadrant, Quadrant]  ;

	return (
		<div>
			<h1>Teknologiledelse radar</h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};