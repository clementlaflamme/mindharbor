export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo"></div>

      <ul className="navbar-links">
        <li><button className="btn-nav-inscription">Inscription</button></li>
        <li><button className="btn-nav-ressources">Ressources</button></li>
        <li><button className="btn-nav-messagerie">Messagerie</button></li>
        <li><button className="btn-nav-groupes">Groupes</button></li>
        <li><button className="btn-nav-stats">Stats</button></li>
        <li><button className="btn-nav-options">Options</button></li>
      </ul>

      <button className="btn-nav-inscription">Inscription</button>
      <button className="btn-nav-connexion">Connexion</button>
      <button className="btn-nav-admin">Administrer</button>
    </nav>
  );
}
