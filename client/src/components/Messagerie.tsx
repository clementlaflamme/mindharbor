import "./messagerie.css";


export default function Messagerie() {
  return (
        
    <div className="messagerie-page">
      <h2 className="titre">Messagerie</h2>
      
        <div className="messagerie-layout">


          <aside className="messagerie-sidebar">
            <h3>Conversations</h3>
            <ul className="conversations-container">
              <li><p></p></li>
              <li><p>conv</p></li>
              <li><p>conv</p></li>
            </ul>
            <button className="new-message-btn">Nouveau Message</button>
          </aside>



          <main className="messagerie-conversation">
            <div className="infos-container"><div className="interlocuteur-container"><h3>Interlocuteur</h3></div><button className="bloquer-btn">Bloquer</button></div>
            <ul className="messages-container">
              <li><p>message</p></li>
              <li><p>message</p></li>
              <li><p>message</p></li>
            </ul>
            <form className="message-input-container">
              <input className="message-input" placeholder="Entrez votre message ici" type="text"></input>
              <button className="message-send-btn">Envoyer</button>
            </form>
            
          </main>



  

      </div>
    </div>
  );
}
