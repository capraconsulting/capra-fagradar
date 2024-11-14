import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import styles from "./radar.module.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export interface Blip {
	id: number;
  name: string;
	logo?: string
	depth: number;
	is_new: boolean;
  element: React.ReactElement;
  x: number;
  y: number;
}

type Color = string; // TODO: is there an html color / css color type?

type QuadrantType = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type BlipProps = {
	blip: Blip;
	color?: Color;
  onClick: Function;
};

const RadarBlip: React.FC<BlipProps> = ({ blip, color, onClick }) => {
	const className = styles.blip + (blip.is_new ? ` ${styles.circleOutline}` : "");

	return (
		<div className={className} style={{ left: blip.x, top: blip.y }}>
			<div
				style={{ background: color, borderColor: color, width: '30px', height: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
				data-tooltip-id="my-tooltip"
				data-tooltip-content={blip.name}
				data-tooltip-place="top"
        onClick={(e) => onClick(e, blip)}
			>
				<img src={blip.logo} style={{maxWidth: '75%', maxHeight: '75%', width: 'auto', height: 'auto' }}></img>
			</div>
		</div>
	);
};

type ArcProps = {
  orientation: QuadrantType;
  outerRadius: number;
	size: number;
};

const Arc : React.FC<ArcProps> = ({ orientation, outerRadius, size }) => {
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

	const drawArc = (_orientation: QuadrantType, outerRadius: number) => {
		const centerX = 0;
		const centerY = size;
		return `
      ${moveTo(centerX, centerY)}
      ${lineTo(centerX, centerY - outerRadius)}
      ${arcTo(outerRadius, outerRadius, 0, 0, 1, centerX + outerRadius, centerY)}
      Z
    `;
	};

  return (
    <g transform={getTransform(orientation, 0, size)}>
      <path
        d={drawArc(orientation, outerRadius)}
        fill="white"
        stroke="#72777D"
        strokeWidth={1}
        />
    </g>
  )
}

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
  name,
	blipColor,
	blips,
  blipOnClick,
	orientation,
	maxDepth,
	size,
}) => {
	const margin = 4 /* px */;

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

		const angleMargin = degreeToRadians(20 / depth);
		const angleScale = scaleLinear()
			.domain([0, blips.length - 1])
			.range([0 + angleMargin, Math.PI / 2 - angleMargin]);

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

	const groupedBlips = Object.groupBy(
    blips,
    ({ depth } : { depth : number }) => depth
  );

	const distributedBlips = Object.keys(groupedBlips).map((depth : string) => {
		return distributeBlips(
			groupedBlips[Number(depth)] as any,
			Number(depth),
			size,
			orientation,
			maxDepth,
		);
	});

	const flattenedArrayBlips = Object.keys(distributedBlips)
    .flatMap(
      (depth : string) => distributedBlips[Number(depth)],
    );

  const quadrantSize = size - margin;

  let arcs = Array(maxDepth + 1)
    .fill(1)
    .map((_itm, i) => i);

  // Draw the biggest arc first to have correct ordering (smaler arcs on top)
  arcs.reverse();

	return (
		<div className={styles.quadrant}>
			<svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {arcs.map((i) => (
        <Arc
          key={`outline-${i}`}
          orientation={orientation}
          outerRadius={quadrantSize * i / maxDepth}
          size={size}
        />
      ))}
			</svg>
			{(flattenedArrayBlips || []).map((blip, i) => (
				<RadarBlip key={`blip-${i}`} blip={blip} color={blipColor} onClick={blipOnClick} />
			))}
			<Tooltip id="my-tooltip" />
      <span className={`${styles.quadrantTitle} ${styles[orientation]}`}>{name}</span>
		</div>
	);
};

export type Quadrant = {
	name: string;
	orientation: QuadrantType;
	blipColor: Color;
	blips: Blip[];
};

const RightAnchoredShelf: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.rightAnchoredShelf}>
    {children}
    </div>
  );
}

type LabelProps = React.PropsWithChildren;

const Label: React.FC<LabelProps> = ({ children }) => {
  return (
    <div className={styles.label}>{children}</div>
  );
}

type BlipInfoProps = {
 blip: Blip;
 onClose: React.MouseEventHandler<HTMLButtonElement>;
}

const BlipInfo: React.FC<BlipInfoProps> = ({ blip, onClose }) => {
  return (
    <RightAnchoredShelf>
      <h2>{blip.name}</h2>
      <div className={styles.labelGroup}>
        <Label>Level {blip.depth}</Label>
        {blip.is_new && (<Label>new</Label>)}
      </div>
      <div>{blip.element}</div>
      <button onClick={onClose}>Close</button>
    </RightAnchoredShelf>
  );
}


interface QuadrantListProps {
	name: string;
	orientation: QuadrantType;
	blips: Blip[];
}

const QuadrantList: React.FC<QuadrantListProps> = ({
  name,
  orientation,
	blips,
}) => {
	const groupedBlips = Object.groupBy(
    blips,
    ({ depth } : { depth : number }) => depth
  );

  return (
    <div className={[styles.quadrantList, styles[orientation]].join(" ")}>
      <h3> {name} </h3>
      <div className={styles.quadrantListsDepth}>
      { Object.keys(groupedBlips).map(depth => {
        const blips = (groupedBlips[Number(depth)] || []) as Blip[];

        return (
          <div key={`quadrantList-${name}-${depth}`}>
            <h3>{ depth }</h3>
            <ul>
            { blips.map((blip, i) => (
              <li key={`quadrantList-${name}-${depth}-${i}`}>
              {blip.name}
              </li>
             ))}
            </ul>
          </div>
        );
      })}
      </div>
    </div>
  );
}

type Props = {
	/*
	 *  List of 4 quadrants
	 */
	quadrants: [Quadrant, Quadrant, Quadrant, Quadrant];
};

export const Radar: React.FC<Props> = ({ quadrants }) => {
  const [currentBlip, setCurrentBlip] = useState<Blip | undefined>();

	const maxDepth = 4;
	const size = 480;

  const blipOnClick = (_e : unknown, blip : Blip) => {
    setCurrentBlip(blip);
  }

	return (
		<>
      <div className={styles.quadrants}>
        <QuadrantList {...(quadrants[0])} />
        <Quadrant
          maxDepth={maxDepth}
          size={size}
          blipOnClick={blipOnClick}
          {...(quadrants[0])}
        />

        <Quadrant
          maxDepth={maxDepth}
          size={size}
          blipOnClick={blipOnClick}
          {...(quadrants[1])}
        />
        <QuadrantList {...(quadrants[1])} />

        <QuadrantList {...(quadrants[2])} />
        <Quadrant
          maxDepth={maxDepth}
          size={size}
          blipOnClick={blipOnClick}
          {...(quadrants[2])}
        />

        <Quadrant
          maxDepth={maxDepth}
          size={size}
          blipOnClick={blipOnClick}
          {...(quadrants[3])}
        />
        <QuadrantList {...(quadrants[3])} />
      </div>

      { currentBlip && (
        <BlipInfo blip={currentBlip} onClose={() => setCurrentBlip(undefined)} />
      )}
		</>
	);
};
