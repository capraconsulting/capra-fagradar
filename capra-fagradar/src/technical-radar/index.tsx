import { createElement } from 'react';
import { Radar, type Blip } from '../radar';


// Dynamically import all mdx files in current dir
const modules = import.meta.glob('./**/*.mdx', { eager: true }) as any;
const logos = import.meta.glob('./**/*.png', { eager: true }) as Record<string, { default: string }>;
const blips: Blip[] = [];


for (const modulePath in modules) {
	const frontmatter =  modules[modulePath]?.frontmatter;
	const defaultExport = modules[modulePath]?.default;
	const logo = logos[modulePath.replace('.mdx', '.png')]?.default;
	const Empty = () => { return <div>Empty</div> };

	blips.push({
		...frontmatter,
		logo,
		element: createElement(defaultExport || Empty),
	});
};

export const TechnicalRadar = () => {
	const quadrants = [
		{
			name: "backend",
			orientation: "top-left",
			blipColor: "rgb(71, 161, 173)",
			blips: [
        ...(blips.filter(item => item.quadrant === 'backend')),
			],
		},
		{
			name: "frontend",
			orientation: "top-right",
			blipColor: "rgb(107, 158, 120)",
			blips: [
        ...(blips.filter(item => item.quadrant === 'frontend')),
			],
		},
		{
			name: "software engineering",
			orientation: "bottom-left",
			blipColor: "rgb(204, 133, 10)",
			blips: [
        ...(blips.filter(item => item.quadrant === 'software_engineering')),
			],
		},
		{
			name: "plattform",
			orientation: "bottom-right",
			blipColor: "rgb(225, 106, 124)",
			blips: [
        ...(blips.filter(item => item.quadrant === 'plattform')),
			],
		},
	];

	return (
		<div>
			<h1> Teknisk radar </h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};
