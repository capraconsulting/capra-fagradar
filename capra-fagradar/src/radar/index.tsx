import React from "react";
import styles from "./radar.module.css";

interface Blip {
  id: number;
  x: number;
  y: number;
  new: boolean;
}

type Color = string; // TODO: is there an html color / css color type?

type QuadrantType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type BlipProps = {
  blip: Blip;
  color?: Color;
}

const Blip: React.FC<BlipProps> = ({ blip, color }) => {
  const fill_and_stroke_color = color || "#69b3a2";
  return (
    <g transform={`translate(${blip.x}, ${blip.y})`}>
      <circle cx="0" cy="0" r="10" fill={fill_and_stroke_color} />
      {blip.new && <circle cx="0" cy="0" r="13" fill="none" stroke={fill_and_stroke_color} strokeWidth="2" />}
      <text x="-5" y="4" fontSize="10" fill="#fff">{blip.id}</text>
    </g>
  );
}

interface RadarChartProps {
  name: string,
  blipColor?: Color;
  blips: Blip[];
  orientation: QuadrantType,
  depth: number,
  size: number,
}

const Quadrant: React.FC<RadarChartProps> = ({ blipColor, blips, orientation, depth, size }) => {
  const getTransform = (orientation: QuadrantType, x: number, y: number) => {
    switch (orientation) {
      case 'top-left':
        return `rotate(-90, ${x}, ${y}) translate(0, 240)`;
      case 'top-right':
        return `rotate(0, ${x}, ${y})`;
      case 'bottom-left':
        return `rotate(180, ${x}, ${y}) translate(-240, 240)`;
      case 'bottom-right':
        return `rotate(90, ${x}, ${y}) translate(-240, 0)`;
      default:
        return `rotate(0, ${x}, ${y})`;
    }
  };

  const moveTo = (x: number, y: number) => `M ${x},${y}`;
  const lineTo = (x: number, y: number) => `L ${x},${y}`;
  const arcTo = (rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number) =>
    `A ${rx},${ry} ${xAxisRotation} ${largeArcFlag},${sweepFlag} ${x},${y}`;

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

  return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size * 2} height={size * 2}
        >
       <g transform={getTransform(orientation, 0, size)}>
          <path d={drawArc(orientation, size)} fill="#afafaf" />
          {Array(depth+1).fill(1).map((_itm, i) => (
            <path key={`outline-${i}`} d={drawArc(orientation, size * i / depth)} fill="none" stroke="#ccc" />
          ))}
        </g>
        {blips.map(blip => (
          <Blip key={blip.id} blip={blip} color={blipColor} />
        ))}
      </svg>
  );
};

type Quadrant = {
  name: string;
  orientation: QuadrantType;
  blipColor: Color;
  blips: Blip[];
}

type Props = {
	/*
	 *  List of 4 quadrants
	 */
	quadrant: [Quadrant, Quadrant, Quadrant, Quadrant];
};

export const Radar: React.FC<Props> = ({ quadrants }) => {
  const depth = 4;
  const size = 240;

	return <>
    <div>
      <select>
        <option value="">Alle kvadranter</option>
        {(quadrants || []).map(({ name }) => (
          <option key={`option-${name}`} value="">{name}</option>
        ))}
      </select>

      <input placeholder="søk i radar" />
    </div>

    <div className={styles.quadrants} style={{ maxWidth: `${size}px` }}>
    { (quadrants || []).map(quadrant => (
      <Quadrant
        key={`${quadrant.name}-${quadrant.orientation}`}
        depth={depth}
        size={size}
        {...quadrant}
        />
    )) }
    </div>
	</>
};
