export default function Navbar({setPageActive}: {setPageActive: (page: string) => void}) {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <img onClick={()=> setPageActive("accueil")} style={{ maxWidth: "200px", height: "auto" }} src="../../ressources/images/MindHarborLogo.png" alt="Logo" />
      </div>

      <div className="navbar-comptes">
        <button onClick={() => setPageActive("inscription")} className="btn-nav-inscription">Inscription</button>
        <button onClick={() => setPageActive("connexion")} className="btn-nav-connexion">Connexion</button>
      </div>

      <div className="navbar-admin">
        <button onClick={() => setPageActive("admin")} className="btn-nav-admin">Administrer</button>
      </div>

      <ul className="navbar-links">
        <li><button onClick={() => setPageActive("journal")} className="btn-nav-inscription">Journal</button></li>
        <li><button onClick={() => setPageActive("ressources")} className="btn-nav-ressources">Ressources</button></li>
        <li><button onClick={() => setPageActive("messagerie")} className="btn-nav-messagerie">Messagerie</button></li>
        <li><button onClick={() => setPageActive("groupes")} className="btn-nav-groupes">Groupes</button></li>
        <li><button onClick={() => setPageActive("analyses")} className="btn-nav-stats">Analyses</button></li>
        <li><button onClick={() => setPageActive("options")} className="btn-nav-options">Options</button></li>
      </ul>

    </nav>
  );
}
