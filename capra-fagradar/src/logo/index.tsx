import React from "react";
import style from "./logo.module.css";
import logo_white from "./logo_white.png";

const Logo: React.FC = () => (
	<div className={style.logo}>
		<img src={logo_white} />
	</div>
);

export default Logo;
