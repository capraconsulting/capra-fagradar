import style from './app.module.css';
import Logo from './logo';

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <Logo />
      <div>
        <a href="https://capraconsulting.no">Tilbake til capraconsulting.no</a>
      </div>
    </footer>
  );
};
