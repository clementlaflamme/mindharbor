import { useEffect, useState } from "react"
import { api } from "../api/api";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import "./css/analyses.css";

export default function Analyses() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [evolution, setEvolution] = useState<Evolution[]>([]);
  const [moyennes, setMoyennes] = useState<Moyennes | null>(null);
  const [jours, setJours] = useState(0);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [indMax, setIndMax] = useState("")
  const [indMin, setIndMin] = useState("")
    interface Stats{
    moyennes: Moyennes,
    evolution: Evolution[],
    dateDebut: string
  }

interface Moyennes{
  _avg:{
    humeur: number | null,
    energie: number | null,
    sommeil: number | null,
    anxiete: number | null
  }
}

interface Evolution{
  date: string,
  humeur: number,
  energie: number,
  sommeil: number,
  anxiete: number
}


function getStats(duree: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    setStats(null);
    return;
  }
    api.get(`/api/v1/journal/stats?range=${duree}`)
    .then(res => setStats(res.data))
    .catch(()=> setStats(null));
}


function nombreJours(jours: number): void{
  setJours(jours);
}

function valeurCheckbox(valeur: string, checked: boolean) {
  if (checked && !metrics.includes(valeur)) {
    setMetrics(prev => [...prev, valeur]);  //cree un nouveau tableau content les elements precedents ...(exploses) pis la nouvelle valeur
  } else if (!checked)
    setMetrics(prev => prev.filter(v => v !== valeur)); //retire la valeur en filtrant la liste
}



const couleursCharte: Record<string, string> = {
  humeur: "red",
  energie: "green",
  sommeil: "blue",
  anxiete: "black"
};

useEffect(() => {
  if (!moyennes) return;

  const moy = moyennes._avg

  const entrees = Object.entries(moy).filter(([_, v]) => v !== null) as [string, number][];
  

  if (entrees.length === 0) {
    setIndMax("");
    setIndMin("");
    return;
  }

  const max = entrees.reduce((a, b) => b[1] > a[1] ? b : a);
  const min = entrees.reduce((a, b) => b[1] < a[1] ? b : a);

  setIndMax(max[0]); 
  setIndMin(min[0]); 
}, [metrics, moyennes]);




useEffect(() => {
  if (!stats) return;
  setEvolution(stats.evolution);
  setMoyennes(stats.moyennes);
}, [stats]);

useEffect(() => {
  getStats(`${jours}d`)
}, [jours])

useEffect(() => {
  getStats("30");
}, []);



  return (

    
    <div className="container-analyses">
        <h2>Analyse de vos données:</h2>

        <div className="interface-graphique">

          <div className="sidebar-graphique">

            <h2>Graphiques</h2>
            
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                className="checkbox-Humeur" 
                value="humeur" 
                onChange={(e)=>valeurCheckbox(e.target.value, e.target.checked)}
              />
              <span className="checkbox-text">Humeur</span>
            </label>
            
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-Energie"
                value="energie"
                onChange={(e) => valeurCheckbox(e.target.value, e.target.checked)}
              />
              <span className="checkbox-text">Energie</span>
            </label>

            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-Sommeil"
                value="sommeil"
                onChange={(e) => valeurCheckbox(e.target.value, e.target.checked)}
              />
              <span className="checkbox-text">Sommeil</span>
            </label>

            <label className="checkbox-container">
              <input
                type="checkbox"
                className="checkbox-Anxiete"
                value="anxiete"
                onChange={(e) => valeurCheckbox(e.target.value, e.target.checked)}
              />
              <span className="checkbox-text">Anxiété</span>
            </label>

          </div>


          <div className="container-graphique">
            <div className="container-graphique-boutons">
              <button onClick={()=> {nombreJours(7)}}>7j.</button>
              <button onClick={()=> {nombreJours(15)}}>15j.</button>
              <button onClick={()=> {nombreJours(30)}}>30j.</button>
              <button onClick={()=> {nombreJours(90)}}>90j.</button>
            </div>
            <div className="graphique">
              <h4>{jours} jours</h4>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={evolution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" interval="preserveStartEnd" stroke="var(--color-text-3)" />
                  
                  <YAxis domain={[0, 5.5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="var(--color-text-3)" />
                  <Tooltip />
                  <Legend />
                  {metrics?.map(metric => (
                    <Line
                      key={metric}
                      type="linear"
                      dataKey={metric}
                      connectNulls
                      dot={{ fill: 'var(--color-surface-base)' }}
                      activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                      stroke={couleursCharte[metric] || "#8884d8"}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="container-stats">
              <h2>Moyenne sur {jours} jours</h2>
              <div className="container-moyennes">
                  
                  <div className="Statistique">
                    <span className="nom-stat">Humeur:</span>
                    <span className="valeur-stat-humeur">{moyennes?._avg.humeur?.toFixed(2)}</span>
                  </div>

                  <div className="Statistique">
                    <span className="nom-stat">Energie:</span>
                    <span className="valeur-stat-energie">{moyennes?._avg.energie?.toFixed(2)}</span>
                  </div>

                  <div className="Statistique">
                    <span className="nom-stat">Sommeil:</span>
                    <span className="valeur-stat-sommeil">{moyennes?._avg.sommeil?.toFixed(2)}</span>
                  </div>

                  <div className="Statistique">
                    <span className="nom-stat">Anxiete:</span>
                    <span className="valeur-stat-anxiete">{moyennes?._avg.anxiete?.toFixed(2)}</span>
                  </div>
              </div>

              <div className="container-obervations">
                  <h3>Observations</h3>
                  <div className="Statistique">
                    <span className="nom-stat">Votre meilleur indicateur: </span>
                    <span style={{ color: couleursCharte[indMax] }} className="valeur-stat-anxiete">{indMax || "-"}</span>
                  </div>

                  <div className="Statistique">
                    <span className="nom-stat">Votre pire indicateur: </span>
                    <span style={{ color: couleursCharte[indMin] }} className="valeur-stat-anxiete">{indMin || "-"}</span>
                  </div>
              </div>
            </div>



          </div>  
          



        </div>
    </div>
  );
}
