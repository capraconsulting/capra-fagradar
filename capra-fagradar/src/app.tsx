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
};

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
				{ id: 1, depth: 1, new: true },
				{ id: 2, depth: 1, new: true },
				{ id: 3, depth: 2, new: true },
				{ id: 4, depth: 2, new: false },
				{ id: 5, depth: 3, new: false },
				{ id: 6, depth: 4, new: false },
				{ id: 7, depth: 4, new: false },
			],
		},
		{
			name: "frontend",
			orientation: "top-right",
			blipColor: "rgb(107, 158, 120)",
			blips: [
				{ id: 8, depth: 1, new: true },
				{ id: 9, depth: 1, new: true },
				{ id: 10, depth: 2, new: true },
				{ id: 11, depth: 2, new: false },
				{ id: 12, depth: 3, new: false },
				{ id: 13, depth: 4, new: false },
				{ id: 14, depth: 4, new: false },
			],
		},
		{
			name: "software engineering",
			orientation: "bottom-left",
			blipColor: "rgb(204, 133, 10)",
			blips: [
				{ id: 15, depth: 1, new: true },
				{ id: 16, depth: 1, new: true },
				{ id: 17, depth: 2, new: true },
				{ id: 18, depth: 2, new: false },
				{ id: 19, depth: 3, new: false },
				{ id: 20, depth: 4, new: false },
				{ id: 21, depth: 4, new: false },
			],
		},
		{
			name: "plattform",
			orientation: "bottom-right",
			blipColor: "rgb(225, 106, 124)",
			blips: [
				{ id: 22, depth: 1, new: true },
				{ id: 23, depth: 1, new: true },
				{ id: 24, depth: 2, new: true },
				{ id: 25, depth: 2, new: false },
				{ id: 26, depth: 3, new: false },
				{ id: 27, depth: 4, new: false },
				{ id: 28, depth: 4, new: false },
				{ id: 29, depth: 4, new: false },
				{ id: 30, depth: 4, new: false },
				{ id: 31, depth: 4, new: false },
				{ id: 32, depth: 4, new: false },
				{ id: 34, depth: 4, new: false },
				{ id: 35, depth: 4, new: false },
				{ id: 36, depth: 4, new: false },
				{ id: 37, depth: 4, new: false },
				{ id: 38, depth: 4, new: false },
				{ id: 39, depth: 4, new: false },
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
				{ id: 18, depth: 1, new: true },
				{ id: 19, depth: 1, new: true },
				{ id: 20, depth: 2, new: true },
				{ id: 21, depth: 2, new: false },
				{ id: 22, depth: 3, new: false },
				{ id: 23, depth: 4, new: false },
				{ id: 24, depth: 4, new: false },
			],
		},
		{
			name: "organisasjon",
			orientation: "top-right",
			blipColor: "rgb(107, 158, 120)",
			blips: [
				{ id: 18, depth: 1, new: true },
				{ id: 19, depth: 1, new: true },
				{ id: 20, depth: 2, new: true },
				{ id: 21, depth: 2, new: false },
				{ id: 22, depth: 3, new: false },
				{ id: 23, depth: 4, new: false },
				{ id: 24, depth: 4, new: false },
			],
		},
		{
			name: "ledelse",
			orientation: "bottom-left",
			blipColor: "rgb(204, 133, 10)",
			blips: [
				{ id: 18, depth: 1, new: true },
				{ id: 19, depth: 1, new: true },
				{ id: 20, depth: 2, new: true },
				{ id: 21, depth: 2, new: false },
				{ id: 22, depth: 3, new: false },
				{ id: 23, depth: 4, new: false },
				{ id: 24, depth: 4, new: false },
			],
		},
		{
			name: "teknisk",
			orientation: "bottom-right",
			blipColor: "rgb(225, 106, 124)",
			blips: [
				{ id: 18, depth: 1, new: true },
				{ id: 19, depth: 1, new: true },
				{ id: 20, depth: 2, new: true },
				{ id: 21, depth: 2, new: false },
				{ id: 22, depth: 3, new: false },
				{ id: 23, depth: 4, new: false },
				{ id: 24, depth: 4, new: false },
			],
		},
	];

	return (
		<div>
			<h1>Teknologiledelse radar</h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};
