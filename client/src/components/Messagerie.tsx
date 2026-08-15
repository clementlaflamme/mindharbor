import { useEffect, useState } from "react";
import "./css/messagerie.css";
import { api } from "../api/api";
import resolveAvatarUrl from "../utils/resolveAvatar";

export default function Messagerie() {
  const [conversations, setConversations] = useState<Interlocuteur[] | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [interlocuteur, setInterlocuteur] = useState<Interlocuteur | null>(null);
  const [nouveauMessage, setNouveauMessage] = useState("");

  interface Utilisateur {
    id: string;
  }

  interface Interlocuteur{
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
    api.get(`/api/v1/messages/${userId}?sort=creeLe&order=asc`)
    .then(res=> setMessages(res.data.messages))
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
                <li key={inter.id} onClick={()=> {setInterlocuteur(inter); getMessages(inter.id);}} className="contact">
                  <img src={resolveAvatarUrl(inter.avatarUrl)} className="avatar" />
                  <p>{inter.pseudonyme}</p>
                </li>
              ))}
            </ul>
            <button className="new-message-btn">Nouveau Message</button>
          </aside>



          <main className="messagerie-conversation">
            <div className="infos-container"><div className="interlocuteur-container"><h3>{interlocuteur?  (<><img src={resolveAvatarUrl(interlocuteur.avatarUrl)} className="avatar"/>{interlocuteur.pseudonyme}</>) : "Messages"}</h3></div><button className="bloquer-btn">Bloquer</button></div>
            <ul className="messages-container">
              {messages?.map(mess => {
              const estMoi = mess.expediteurId === utilisateur?.id;
              return(  
                <li key={mess.id} className="message">
                  <p>{estMoi? "Moi" : interlocuteur?.pseudonyme} : {mess.contenu}</p>
                </li>
              )
              })}
            </ul>

            <form className="message-input-container" onSubmit={
                (e)=>{
                    e.preventDefault(); 
                    console.log("Message Envoyé")
                    if (interlocuteur) {
                      api.post(`/api/v1/messages/${interlocuteur.id}`)
                      setNouveauMessage("")
                    }


                }

              }>
              
              <input 
                className="message-input" 
                placeholder="Entrez votre message ici" 
                type="text"
                value = {nouveauMessage}
                onChange={(e) => setNouveauMessage(e.target.value)}
              />
              <button className="message-send-btn">Envoyer</button>
            </form>
            
          </main>



  

      </div>
    </div>
  );
}
