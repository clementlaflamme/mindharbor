import "./messagerie.css";


export default function Messagerie() {
  return (
        
    <div className="messagerie-page">
      <h2 className="titre">Messagerie</h2>
      
        <div className="messagerie-layout">


          <aside className="messagerie-sidebar">
            <h3>Conversations</h3>
            <ul>
              <li><p></p></li>
              <li><p>conv</p></li>
              <li><p>conv</p></li>
            </ul>
            <button className="new-message-btn">Nouveau Message</button>
          </aside>



          <main className="messagerie-conversation">
            <h3>Messages</h3>
            <ul>
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
