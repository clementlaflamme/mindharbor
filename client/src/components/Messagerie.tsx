import { useEffect, useState } from "react";
import "./messagerie.css";
import { api } from "../api/api";
import resolveAvatarUrl from "../utils/resolveAvatar";

export default function Messagerie() {
  const [conversations, setConversations] = useState<interlocuteur[] | null>(null);
  const [messages, setMessages] = useState(null);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);


  interface Utilisateur {
    id: string;
  }

  interface interlocuteur{
    id: string,
    pseudonyme: string,
    avatarUrl: string
  }

  interface Message {
    id: string,
    expediteurId: string,
    destinataireId: string,
    sujet: string,
    contenu: string,
    lu: boolean,
    creeLe: string
  }

  function getUtilisateur() {
    const token = localStorage.getItem("token");
    if (!token) {
      setUtilisateur(null);
      return;
    }

    api.get("/api/v1/auth/me")
    .then(res => setUtilisateur(res.data))
    .catch(()=> setUtilisateur(null));
  }

  function getConversations(){
    if (!utilisateur) {
      setConversations(null)
      return;
    }
    api.get("/api/v1/messages")
    .then(res=> setConversations(res.data.conversations))
    .catch(()=>setConversations(null));
  }

  function getMessages(userId: string){
    if (!utilisateur) {
      setMessages(null)
      return;
    }
    api.get(`/api/v1/messages/${userId}`)
    .then(res=> setMessages(res.data))
    .catch(()=> setMessages(null));
  }

  useEffect(() => {
    getUtilisateur();
  }, []);

  useEffect(()=>{
    if (utilisateur) {
      getConversations();
    }
  }, [utilisateur])


  return (
        
    <div className="messagerie-page">
      <h2 className="titre">Messagerie</h2>
      
        <div className="messagerie-layout">


          <aside className="messagerie-sidebar">
            <h3>Conversations</h3>
            <ul className="conversations-container">
              {conversations?.map(inter => (
                <li key={inter.id} onClick={()=> getMessages(inter.id)} className="contact">
                  <img src={resolveAvatarUrl(inter.avatarUrl)} className="avatar" />
                  <p>{inter.pseudonyme}</p>
                </li>
              ))}
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
