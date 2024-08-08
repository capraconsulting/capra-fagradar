import { Outlet, Link } from "react-router-dom";
import style from "./app.module.css";
import Logo from "./logo";
import { Breadcrumb } from "./breadcrumb";
import { Radar } from "./radar";

const Header = () => {
	return (
		<header className={style.header}>
			<Link to="/">
				<Logo />
				<h1>Fagradar</h1>
			</Link>
			<div className={style.links}>
				<Link to="/technical-radar/">Teknisk radar</Link>
				<Link to="/tech-leader-radar/">Teknologiledelse radar</Link>
			</div>
		</header>
	);
};

const Footer = () => {
  return (
    <footer className={style.footer}>
				<Logo />
        <div>
          <a href="https://capraconsulting.no">Tilbake til capraconsulting.no</a>
        </div>
    </footer>
  );
}

export const App = () => {
	return (
		<div>
			<Header />
			<main>
				<Breadcrumb />
				<Outlet />
			</main>
      <Footer />
		</div>
	);
};

const HalfWidthSection = ({ children }) => {
	return <section className={style.halfWidthSection}>{children}</section>;
};

export const MainPage = () => {
	return (
		<>
			<h2> Capra sine fagradarer </h2>
			<HalfWidthSection>
				<Link to="/technical-radar/">Teknisk radar</Link>
			</HalfWidthSection>
			<HalfWidthSection>
				<Link to="/tech-leader-radar/">Teknologiledelse radar</Link>
			</HalfWidthSection>
		</>
	);
};

export const TechnicalRadar = () => {
	const quadrants = [
    {
      name: "backend",
      orientation: "top-left",
      blipColor: "rgb(71, 161, 173)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "frontend",
      orientation: "top-right",
      blipColor: "rgb(107, 158, 120)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "software engineering",
      orientation: "bottom-left",
      blipColor: "rgb(204, 133, 10)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "plattform",
      orientation: "bottom-right",
      blipColor: "rgb(225, 106, 124)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
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

export const TechLeaderRadar = () => {
	const quadrants = [
    {
      name: "smidig",
      orientation: "top-left",
      blipColor: "rgb(71, 161, 173)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "organisasjon",
      orientation: "top-right",
      blipColor: "rgb(107, 158, 120)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "ledelse",
      orientation: "bottom-left",
      blipColor: "rgb(204, 133, 10)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    },
    {
      name: "teknisk",
      orientation: "bottom-right",
      blipColor: "rgb(225, 106, 124)",
      blips: [
        { id: 18, x: 60, y: 110, new: true },
        { id: 19, x: 160, y: 50, new: true },
        { id: 20, x: 40, y: 160, new: true },
        { id: 21, x: 120, y: 220, new: false },
        { id: 22, x: 200, y: 80, new: false },
        { id: 23, x: 100, y: 190, new: false },
        { id: 24, x: 60, y: 240, new: false },
      ],
    }
  ];

	return (
		<div>
			<h1>Teknologiledelse radar</h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};
