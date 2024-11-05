import { Link } from "react-router-dom";
import style from "./app.module.css";
import Logo from "./logo";

export const Header = () => {
	return (
		<header className={style.header}>
			<Link to="/">
				<Logo />
				<h1>Fagradar</h1>
			</Link>
			<div className={style.links}>
				<Link to="/technical-radar/">Teknisk radar</Link>
				<Link to="/tech-leader-radar/">Teknologiledelse radar</Link>
				<Link to="/om-fagradar/">Om fagradaren</Link>
			</div>
		</header>
	);
};
