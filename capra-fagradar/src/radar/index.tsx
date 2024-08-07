import React from "react";
import styles from "./radar.module.css";

interface Blip {
  id: number;
  x: number;
  y: number;
  new: boolean;
}

interface RadarChartProps {
  blips: Blip[];
  quadrant: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  depth: number,
}

const RadarChart: React.FC<RadarChartProps> = ({ blips, quadrant, depth }) => {
  const getTransform = () => {
    switch (quadrant) {
      case 'top-left':
        return 'rotate(0)';
      case 'top-right':
        return 'rotate(90)';
      case 'bottom-left':
        return 'rotate(-90)';
      case 'bottom-right':
        return 'rotate(180)';
      default:
        return 'rotate(0)';
    }
  };

  const moveTo = (x: number, y: number) => `M ${x},${y}`;
  const lineTo = (x: number, y: number) => `L ${x},${y}`;
  const arcTo = (rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, x: number, y: number) =>
    `A ${rx},${ry} ${xAxisRotation} ${largeArcFlag},${sweepFlag} ${x},${y}`;

  const drawArc = (centerX: number, centerY: number, outerRadius: number) => {
    return `
      ${moveTo(centerX, centerY)}
      ${lineTo(centerX, centerY - outerRadius)}
      ${arcTo(outerRadius, outerRadius, 0, 0, 1, centerX + outerRadius, centerY)}
      Z
    `;
  };

	const size = 240;
	const x = 0;
  const y = size;

  return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size * 2} height={size * 2} style={{ border: '1px solid blue' }}>
       <g transform={getTransform()}>
          <path d={drawArc(x, y, size)} fill="#afafaf" />
          {Array(depth).fill(1).map((_itm, i) => (
            <path d={drawArc(x, y, size * i / depth)} fill="none" stroke="#ccc" />
          ))}
        </g>
        {blips.map(blip => (
          <g key={blip.id} transform={`translate(${blip.x}, ${blip.y})`}>
            <circle cx="0" cy="0" r="10" fill="#69b3a2" />
            {blip.new && <circle cx="0" cy="0" r="13" fill="none" stroke="#69b3a2" strokeWidth="2" />}
            <text x="-5" y="4" fontSize="10" fill="#fff">{blip.id}</text>
          </g>
        ))}
      </svg>
  );
};

type Props = {
	/*
	 *  List of 4 quadrants
	 */
	quadrant: [string, string, string, string];
};

export const Radar: React.FC<Props> = ({ quadrants }) => {
  const blips = [
    { id: 18, x: 60, y: 110, new: true },
    { id: 19, x: 160, y: 50, new: true },
    { id: 20, x: 40, y: 160, new: true },
    { id: 21, x: 120, y: 220, new: false },
    { id: 22, x: 200, y: 80, new: false },
    { id: 23, x: 100, y: 190, new: false },
    { id: 24, x: 60, y: 240, new: false },
  ];

	return <>
    <div>
      <select>
        <option value="">Alle kvadranter</option>
        {(quadrants || []).map((quadrant) => (
          <option value="">{quadrant}</option>
        ))}
      </select>

      <input placeholder="søk i radar" />
    </div>

    <RadarChart blips={blips} quadrant="top-left" depth={4} />
	</>
};
