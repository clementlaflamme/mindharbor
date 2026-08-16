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
  const [nouveauDestinataireId, setNouveauDestinataireId] = useState<string | null>(null);
  const [nouveauDestinatairePseudo, setNouveauDestinatairePseudo] = useState<string>("");

  interface Utilisateur {
    id: string;
  }

  interface Interlocuteur{
    id: string,
    pseudonyme: string,
    avatarUrl: string,
    nonLus: number
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
    .then(res=> setConversations([...res.data.conversations]))
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


  useEffect(() => {
  if (interlocuteur) {
    // Récupère les messages ET déclenche le marquage comme lu côté serveur 
    api.get(`/api/v1/messages/${interlocuteur.id}?sort=creeLe&order=asc`)
      .then(res => {
        setMessages(res.data.messages);
        // Ensuite met la liste a jour pour que le marquage non plus soit fait sans avoir a rafraichis ou a 
        // cliquer sur une autre conversation pour que ca soit visible
        getConversations();
      })
      .catch(() => setMessages(null));
  }
}, [interlocuteur]);



  return (
        
    <div className="messagerie-page">
      <h2 className="titre">Messagerie</h2>
      
        <div className="messagerie-layout">


          <aside className="messagerie-sidebar">
            <h3>Conversations</h3>
            <ul className="conversations-container">
              {conversations?.map(inter => (
                <li key={inter.id} onClick={()=> {setInterlocuteur(inter)}} className="contact">
                  <img src={resolveAvatarUrl(inter.avatarUrl)} className="avatar" />
                  <p
                    style={{fontWeight: inter.nonLus > 0 ? "bold" : "normal"}}
                  >{inter.pseudonyme}</p>
                </li>
              ))}
            </ul>
            <button className="new-message-btn" onClick={()=>{setInterlocuteur(null), setMessages(null)}}>Nouveau Message</button>
          </aside>



          <main className="messagerie-conversation">
            <div className="infos-container">
              <div className="interlocuteur-container">
                {interlocuteur? (
                  <>
                    <div className="interlocuteur-container">
                      <img src={resolveAvatarUrl(interlocuteur.avatarUrl)} className="avatar" />
                      <h3>{interlocuteur.pseudonyme}</h3>
                    </div>
                  </>) :

                  <><h3>Destinataire: </h3>
                  <input
                    type="text" 
                    className="interlocuteur-input"
                    value={nouveauDestinatairePseudo}
                    onChange={
                      async (e) => {
                        const pseudo = e.target.value;
                        setNouveauDestinatairePseudo(pseudo);

                        if (pseudo.trim() === "") {
                          setNouveauDestinataireId(null);
                          return;
                        }

                        try {
                          const res = await api.get(`/api/v1/users/pseudo/${pseudo}`);
                          if (res.data.niveauContact != "TOUT_LE_MONDE") {
                            return;
                          }
                          setNouveauDestinataireId(res.data.id)
                        } catch {
                          setNouveauDestinataireId(null)
                        }
                      }
                    }
                  /><p style={{color: nouveauDestinataireId ? "green" : "red"}} className="statut-recherche">
                    {nouveauDestinatairePseudo.trim() !== "" 
                    ? (nouveauDestinataireId 
                      ? `Utilisateur trouve` 
                      : "Utilisateur Introuvable"
                    )
                    : ""
                    }
                    </p></>

                }
              </div>
              {/* empecher de se bloquer soi meme (le boutton disparrait) et disparrait quand pas d'interlocuteur */}
              {((interlocuteur && interlocuteur.id !== utilisateur?.id) || (!interlocuteur && nouveauDestinataireId))  && (<button className="bloquer-btn" onClick={ async ()=>{  
                  const idaBloquer = interlocuteur ? interlocuteur.id : nouveauDestinataireId;
                  await api.post(`/api/v1/users/${idaBloquer}/block`);
                  setInterlocuteur(null);
                  setNouveauDestinatairePseudo("");
                  setMessages(null);
                  getConversations();
                }}>Bloquer</button>)}
            </div>
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
                async (e)=>{
                    e.preventDefault(); 
                    console.log("Message Envoyé")
                    const destId = interlocuteur ? interlocuteur.id : nouveauDestinataireId;

                    if(!destId || !nouveauMessage.trim()) {
                      return;
                    }

                    try {
                      
                      await api.post(`/api/v1/messages/${destId}`,{ contenu: nouveauMessage });
                      setNouveauMessage("");

                      if (interlocuteur){
                        getMessages(interlocuteur.id);
                      } else {
                        const res = await api.get(`/api/v1/messages/${destId}?sort=creeLe&order=asc`);
                        setInterlocuteur(res.data.interlocuteur)

                        getConversations();
                        getMessages(destId);

                        setNouveauDestinatairePseudo("");
                        setNouveauDestinataireId(null);
                      }
                      
                    } catch (err) {
                      console.error("Erreur envoi message: ", err)
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
              <button className="message-send-btn" disabled={nouveauMessage === ""}>Envoyer</button>
            </form>
            
          </main>

      </div>
    </div>
  );
}
