import { Outlet, Link } from "react-router-dom";
import style from "./app.module.css";
import { Breadcrumb } from "./breadcrumb";
import { Header } from "./header";
import { Footer } from "./footer";

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

const HalfWidthSection : React.FC<React.PropsWithChildren> = ({ children }) => {
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
