import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer" style={{borderTop: "4px solid var(--couleur-palette1)"}}>
        <div style={{ display: "flex", justifyContent: "flex-end"}} className="badgeArea">
            <div className="badgeUrgence">911</div>
            <div className="badgeUrgence">1-866-APPELLE</div>
        </div>
        <p style={{fontSize: "0.8em"}}>&copy; 2026 MindHarbor. Tous droits réservés.</p>
    
    </footer>
  );
}