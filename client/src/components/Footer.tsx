import "./css/footer.css";

export default function Footer() {
  return (
    <footer className="footer" style={{ display: "flex", justifyContent: "space-between", borderTop: "4px solid var(--couleur-palette1)"}}>
        <p style={{fontSize: "0.8em", justifyContent: "flex-start"}}>&copy; 2026 MindHarbor. Tous droits réservés.</p>
        <div style={{ display: "flex", justifyContent: "flex-end"}} className="badgeArea">
            <div className="badgeUrgence">911</div>
            <div className="badgeUrgence">1-866-APPELLE</div>
        </div>
    
    </footer>
  );
}