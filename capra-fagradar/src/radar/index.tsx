import React from "react";
import { scaleLinear } from "d3-scale";
import styles from "./radar.module.css";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { useRadarStore } from "./radar-store";

export interface Blip {
  id: number;
  name: string;
  blipNumber: number;
  logo?: string;
  depth: number;
  is_new: boolean;
  element: React.ReactElement;
  quadrant: string;
  x: number;
  y: number;
}

type Color = string; // TODO: is there an html color / css color type?

type QuadrantType = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type BlipProps = {
  blip: Blip;
  color?: Color;
};

const RadarBlip: React.FC<BlipProps> = ({ blip, color }) => {
  const className =
    styles.blip + (blip.is_new ? ` ${styles.circleOutline}` : "");

  const { selectBlip, highlightBlip, highlightedBlip } = useRadarStore();

  return (
    <div className={className} style={{ left: blip.x, top: blip.y }}>
      <div
        style={{
          background:
            highlightedBlip?.blipNumber === blip.blipNumber
              ? `${color}99`
              : color,
          borderColor: color,
          width: "30px",
          height: "30px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        data-tooltip-id="my-tooltip"
        data-tooltip-content={blip.name}
        data-tooltip-place="top"
        onMouseEnter={() => highlightBlip(blip)}
        onMouseLeave={() => highlightBlip(undefined)}
        onClick={() => selectBlip(blip)}
      >
        {blip.blipNumber}
      </div>
    </div>
  );
};

type ArcProps = {
  orientation: QuadrantType;
  outerRadius: number;
  size: number;
};

const Arc: React.FC<ArcProps> = ({ orientation, outerRadius, size }) => {
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
  );
};

interface RadarChartProps {
  name: string;
  blipColor?: Color;
  blips: Blip[];
  orientation: QuadrantType;
  maxDepth: number;
  size: number;
}

const Quadrant: React.FC<RadarChartProps> = ({
  name,
  blipColor,
  blips,
  orientation,
  size,
}) => {
  const margin = 4; /* px */

  // Define the custom cumulative fractions for each arc level
  const cumulativeFractions = [0, 0.5, 0.7, 0.9, 1];

  const distributeBlips = (
    blips: Blip[],
    depth: number,
    size: number,
    quadrant: QuadrantType,
  ) => {
    const degreeToRadians = (degrees: number) => (degrees / 360) * 2 * Math.PI;

    // Define the angle range for the quadrant
    const angleStart = 0;
    const angleEnd = Math.PI / 2; // 90 degrees in radians

    // Adjust radius calculation using custom fractions
    const innerFraction = cumulativeFractions[depth - 1];
    const outerFraction = cumulativeFractions[depth];

    const innerRadius = innerFraction * (size - margin);
    const outerRadius = outerFraction * (size - margin);

    // Blip properties
    const blipSize = 30; // blip size in pixels
    const minSpacing = 5; // minimum spacing between blips in pixels

    if (depth === 1) {
      // For depth === 1, arrange blips in two rows
      // Calculate the radii for the two rows
      const rowRadii = [
        innerRadius + (outerRadius - innerRadius) / 2.5,
        innerRadius + (1.5 * outerRadius - innerRadius) / 2.5,
        innerRadius + (2 * (outerRadius - innerRadius)) / 2.5,
      ];

      // Determine how many blips can fit in each row without overlapping
      // Calculate the circumference for each row arc
      const rowCircumferences = rowRadii.map(
        (radius) => radius * (angleEnd - angleStart),
      );

      // Approximate number of blips that can fit in each row
      const blipsPerRow = rowCircumferences.map((circumference) =>
        Math.floor(circumference / (blipSize + minSpacing)),
      );

      // Total blips that can be placed without overlapping
      const totalCapacity = blipsPerRow.reduce((a, b) => a + b, 0);

      // If we have more blips than capacity, we need to adjust
      const totalBlips = blips.length;
      const blipsPerRowAdjusted = blipsPerRow.map((capacity) =>
        Math.floor((capacity / totalCapacity) * totalBlips),
      );

      // Adjust for any rounding errors
      let adjustedTotal = blipsPerRowAdjusted.reduce((a, b) => a + b, 0);
      let diff = totalBlips - adjustedTotal;
      let rowIndex = 0;
      while (diff > 0) {
        blipsPerRowAdjusted[rowIndex % 2]++;
        adjustedTotal++;
        diff--;
        rowIndex++;
      }

      // Now distribute blips into the two rows
      const blipsInRows: Array<Array<Blip>> = [[], [], []];
      let blipIndex = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < blipsPerRowAdjusted[i]; j++) {
          blipsInRows[i].push(blips[blipIndex]);
          blipIndex++;
        }
      }

      // Now compute positions for blips in each row
      const positionedBlips = [];
      for (let row = 0; row < 3; row++) {
        const radius = rowRadii[row];
        const numBlipsInRow = blipsInRows[row].length;
        const angleSpacing = (angleEnd - angleStart) / numBlipsInRow;

        for (let i = 0; i < numBlipsInRow; i++) {
          const blip = blipsInRows[row][i];
          const angle = angleStart + angleSpacing * (i + 0.5); // Offset by 0.5 to center blips

          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          let adjustedX, adjustedY;
          switch (quadrant) {
            case "top-left":
              adjustedX = size - x;
              adjustedY = size - y;
              break;
            case "top-right":
              adjustedX = 0 + x;
              adjustedY = size - y;
              break;
            case "bottom-left":
              adjustedX = size - x;
              adjustedY = 0 + y;
              break;
            case "bottom-right":
              adjustedX = 0 + x;
              adjustedY = 0 + y;
              break;
          }

          positionedBlips.push({
            ...blip,
            x: adjustedX,
            y: adjustedY,
          });
        }
      }

      return positionedBlips;
    } else {
      // For other depths, keep existing distribution logic
      const angleMargin = degreeToRadians(20 / depth);
      const angleScale = scaleLinear()
        .domain([0, blips.length - 1])
        .range([angleStart + angleMargin, angleEnd - angleMargin]);

      return blips.map((blip, index) => {
        const angle = angleScale(index);
        const radius = (innerRadius + outerRadius) / 2;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        let adjustedX, adjustedY;
        switch (quadrant) {
          case "top-left":
            adjustedX = size - x;
            adjustedY = size - y;
            break;
          case "top-right":
            adjustedX = 0 + x;
            adjustedY = size - y;
            break;
          case "bottom-left":
            adjustedX = size - x;
            adjustedY = 0 + y;
            break;
          case "bottom-right":
            adjustedX = 0 + x;
            adjustedY = 0 + y;
            break;
        }

        return {
          ...blip,
          x: adjustedX,
          y: adjustedY,
        };
      });
    }
  };

  const groupedBlips = Object.groupBy(
    blips,
    ({ depth }: { depth: number }) => depth,
  );

  const distributedBlips = Object.keys(groupedBlips).map((depth: string) => {
    return distributeBlips(
      groupedBlips[Number(depth)] as any,
      Number(depth),
      size,
      orientation,
    );
  });

  const flattenedArrayBlips = Object.keys(distributedBlips).flatMap(
    (depth: string) => distributedBlips[Number(depth)],
  );

  const quadrantSize = size - margin;

  // Use custom cumulative fractions to define arcs
  const arcs = cumulativeFractions.slice(1).reverse();

  return (
    <div className={styles.quadrant}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {arcs.map((fraction, i) => (
          <Arc
            key={`outline-${i}`}
            orientation={orientation}
            outerRadius={quadrantSize * fraction}
            size={size}
          />
        ))}
      </svg>
      {(flattenedArrayBlips || []).map((blip, i) => (
        <RadarBlip key={`blip-${i}`} blip={blip} color={blipColor} />
      ))}
      <Tooltip id="my-tooltip" />
      <span className={`${styles.quadrantTitle} ${styles[orientation]}`}>
        {name}
      </span>
    </div>
  );
};

export type Quadrant = {
  name: string;
  orientation: QuadrantType;
  blipColor: Color;
  blips: Blip[];
};

const RightAnchoredShelf: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className={styles.rightAnchoredShelf}>{children}</div>;
};

type LabelProps = React.PropsWithChildren;

const Label: React.FC<LabelProps> = ({ children }) => {
  return <div className={styles.label}>{children}</div>;
};

type BlipInfoProps = {
  blip: Blip;
};

const BlipInfo: React.FC<BlipInfoProps> = ({ blip }) => {
  const { selectBlip } = useRadarStore();
  return (
    <RightAnchoredShelf>
      <h2>
        {blip.name}{" "}
        {blip.logo ? (
          <img
            alt=""
            src={blip.logo}
            style={{
              maxWidth: "75%",
              maxHeight: "75%",
              width: "auto",
              height: "auto",
            }}
          />
        ) : null}
      </h2>

      <div className={styles.labelGroup}>
        <Label>Level {blip.depth}</Label>
        {blip.is_new && <Label>new</Label>}
      </div>
      <div>{blip.element}</div>
      <button type="button" onClick={() => selectBlip(undefined)}>
        Close
      </button>
    </RightAnchoredShelf>
  );
};

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
    ({ depth }: { depth: number }) => depth,
  );

  const { selectBlip, highlightBlip, highlightedBlip } = useRadarStore();
  return (
    <div className={[styles.quadrantList, styles[orientation]].join(" ")}>
      <h3> {name} </h3>
      <div className={styles.quadrantListsDepth}>
        {Object.keys(groupedBlips).map((depth) => {
          const blips = (groupedBlips[Number(depth)] || []) as Blip[];

          return (
            <div key={`quadrantList-${name}-${depth}`}>
              <h3>{depth}</h3>
              <ul>
                {blips.map((blip, i) => (
                  <li
                    key={`quadrantList-${name}-${depth}-${i}`}
                    onClick={() => selectBlip(blip)}
                    onMouseEnter={() => highlightBlip(blip)}
                    onMouseLeave={() => highlightBlip(undefined)}
                    style={{
                      listStyle: "none",
                      textDecoration:
                        blip.blipNumber === highlightedBlip?.blipNumber
                          ? "underline"
                          : "",
                    }}
                  >
                    {blip.blipNumber} - {blip.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type Props = {
  /*
   *  List of 4 quadrants
   */
  quadrants: [Quadrant, Quadrant, Quadrant, Quadrant];
};

export const Radar: React.FC<Props> = ({ quadrants }) => {
  const { currentBlip } = useRadarStore();

  const maxDepth = 4;
  const size = 480;

  return (
    <>
      <div className={styles.quadrants}>
        <QuadrantList {...quadrants[0]} />

        <Quadrant maxDepth={maxDepth} size={size} {...quadrants[0]} />

        <Quadrant maxDepth={maxDepth} size={size} {...quadrants[1]} />

        <QuadrantList {...quadrants[1]} />

        <QuadrantList {...quadrants[2]} />

        <Quadrant maxDepth={maxDepth} size={size} {...quadrants[2]} />

        <Quadrant maxDepth={maxDepth} size={size} {...quadrants[3]} />

        <QuadrantList {...quadrants[3]} />
      </div>

      {currentBlip && <BlipInfo blip={currentBlip} />}
    </>
  );
};
