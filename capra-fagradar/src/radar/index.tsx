import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import styles from "./radar.module.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

interface Blip {
	id: number;
  name: string;
	depth: number;
	is_new: boolean;
}

type Color = string; // TODO: is there an html color / css color type?

type QuadrantType = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type BlipProps = {
	blip: Blip;
	color?: Color;
  onClick: Function;
};

const Blip: React.FC<BlipProps> = ({ blip, color, onClick }) => {
	const className = styles.blip + (blip.is_new ? ` ${styles.circleOutline}` : "");

	return (
		<div className={className} style={{ left: blip.x, top: blip.y }}>
			<div
				style={{ background: color, borderColor: color }}
				data-tooltip-id="my-tooltip"
				data-tooltip-content={blip.name}
				data-tooltip-place="top"
        onClick={(e) => onClick(e, blip)}
			>
				{blip.id}
			</div>
		</div>
	);
};

interface RadarChartProps {
	name: string;
	blipColor?: Color;
	blips: Blip[];
  blipOnClick: Function;
	orientation: QuadrantType;
	maxDepth: number;
	size: number;
}

const Quadrant: React.FC<RadarChartProps> = ({
	blipColor,
	blips,
  blipOnClick,
	orientation,
	maxDepth,
	size,
}) => {
	const margin = 4 /* px */;

	const getTransform = (orientation: QuadrantType, x: number, y: number) => {
		switch (orientation) {
			case "top-left":
				return `rotate(-90, ${x}, ${y}) translate(0, ${size})`;
			case "top-right":
				return `rotate(0, ${x}, ${y})`;
			case "bottom-left":
				return `rotate(180, ${x}, ${y}) translate(-${size}, ${size})`;
			case "bottom-right":
				return `rotate(90, ${x}, ${y}) translate(-${size}, 0)`;
			default:
				return `rotate(0, ${x}, ${y})`;
		}
	};

	const moveTo = (x: number, y: number) => `M ${x},${y}`;
	const lineTo = (x: number, y: number) => `L ${x},${y}`;
	const arcTo = (
		rx: number,
		ry: number,
		xAxisRotation: number,
		largeArcFlag: number,
		sweepFlag: number,
		x: number,
		y: number,
	) => `A ${rx},${ry} ${xAxisRotation} ${largeArcFlag},${sweepFlag} ${x},${y}`;

	const drawArc = (orientation: QuadrantType, outerRadius: number) => {
		const centerX = 0;
		const centerY = size;
		return `
      ${moveTo(centerX, centerY)}
      ${lineTo(centerX, centerY - outerRadius)}
      ${arcTo(outerRadius, outerRadius, 0, 0, 1, centerX + outerRadius, centerY)}
      Z
    `;
	};

	const distributeBlips = (
		blips: Blip[],
		depth: number,
		size: number,
		quadrant: QuadrantType,
		maxDepth: number,
	) => {
		/*
		 *  Converts from degrees in range 0-360 to radians
		 */
		const degreeToRadians = (degrees: number) => (degrees / 360) * 2 * Math.PI;

		const margin = degreeToRadians(5);
		const angleScale = scaleLinear()
			.domain([0, blips.length - 1])
			.range([0 + margin, Math.PI / 2 - margin]);

		return blips.map((blip, index) => {
			const angle = angleScale(index);
			const radius = ((depth - 0.5) * (size - margin)) / maxDepth;

			const x = radius * Math.cos(angle);
			const y = radius * Math.sin(angle);

			switch (quadrant) {
				case "top-left":
					return {
						...blip,
						x: size - x,
						y: size - y,
					};
				case "top-right":
					return {
						...blip,
						x: 0 + x,
						y: size - y,
					};
				case "bottom-left":
					return {
						...blip,
						x: size - x,
						y: 0 + y,
					};
				case "bottom-right":
					return {
						...blip,
						x: 0 + x,
						y: 0 + y,
					};
			}
		});
	};

	const groupedBlips = Object.groupBy(blips, ({ depth }) => depth);

	const distributedBlips = Object.keys(groupedBlips).map((depth) => {
		return distributeBlips(
			groupedBlips[depth],
			depth,
			size,
			orientation,
			maxDepth,
		);
	});

	const flattenedArrayBlips = Object.keys(distributedBlips).flatMap(
		(depth) => distributedBlips[depth],
	);

	return (
		<div className={styles.quadrant}>
			<svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
				<g transform={getTransform(orientation, 0, size)}>
					<path d={drawArc(orientation, size - margin)} fill="white" />
					{Array(maxDepth + 1)
						.fill(1)
						.map((_itm, i) => (
							<path
								key={`outline-${i}`}
								d={drawArc(orientation, ((size - margin) * i) / maxDepth)}
								fill="none"
								stroke="#72777D"
								strokeWidth={1}
							/>
						))}
				</g>
			</svg>
			{(flattenedArrayBlips || []).map((blip) => (
				<Blip key={blip.id} blip={blip} color={blipColor} onClick={blipOnClick} />
			))}
			<Tooltip id="my-tooltip" />
		</div>
	);
};

type Quadrant = {
	name: string;
	orientation: QuadrantType;
	blipColor: Color;
	blips: Blip[];
};

const RightAnchoredShelf: React.FC = ({ children }) => {
  return (
    <div className={styles.rightAnchoredShelf}>
    {children}
    </div>
  );
}

const BlipInfo: React.FC<{ blip: Blip, onClose: Function }> = ({ blip, onClose }) => {
  return (
    <RightAnchoredShelf>
      <h1>{blip.name}</h1>
      <div>{blip.element}</div>
      <button onClick={onClose}>Close</button>
    </RightAnchoredShelf>
  );
}

type Props = {
	/*
	 *  List of 4 quadrants
	 */
	quadrant: [Quadrant, Quadrant, Quadrant, Quadrant];
};

export const Radar: React.FC<Props> = ({ quadrants }) => {
  const [currentBlip, setCurrentBlip] = useState();

	const maxDepth = 4;
	const size = 480;

  const blipOnClick = (e, blip) => {
    setCurrentBlip(blip);
  }

	return (
		<>
			<div>
				<select>
					<option value="">Alle kvadranter</option>
					{(quadrants || []).map(({ name }) => (
						<option key={`option-${name}`} value="">
							{name}
						</option>
					))}
				</select>

				<input placeholder="søk i radar" />
			</div>

			<div className={styles.quadrants} style={{ maxWidth: `${size}px` }}>
				{(quadrants || []).map((quadrant) => (
					<Quadrant
						key={`${quadrant.name}-${quadrant.orientation}`}
						maxDepth={maxDepth}
						size={size}
            blipOnClick={blipOnClick}
						{...quadrant}
					/>
				))}
			</div>

      { currentBlip && (
        <BlipInfo blip={currentBlip} onClose={() => setCurrentBlip()} />
      )}
		</>
	);
};
