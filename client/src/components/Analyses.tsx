import { useEffect, useState } from "react"
import { api } from "../api/api";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import "./css/analyses.css";

export default function Analyses() {
  // const [tendances, setTendances] = useState<Tendances | null>(null);
  // const [evoHumeur, setEvoHumeur] = useState<DateScore[]>([]);
  // const [evoEnergie, setEvoEnergie] =useState<DateScore[]>([]);
  // const [evoSommeil, setEvoSommeil] =useState<DateScore[]>([]);
  // const [evoAnxiete, setEvoAnxiete] =useState<DateScore[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [evolution, setEvolution] = useState<Evolution | null>(null);
  const [moyennes, setMoyennes] = useState<Moyennes | null>(null);
  const [jours, setJours] = useState(0);
  const [metrics, setMetrics] = useState<string[]>([]);
    interface Stats{
    moyennes: Moyennes,
    evolution: Evolution,
    dateDebut: string
  }

  interface DateScore{
  date: string,
  score: number | null;
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
  humeur: DateScore[],
  energie: DateScore[],
  sommeil: DateScore[],
  anxiete: DateScore[]
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


// reviser cette ecrite 100% avec copilot
// formatte toutes les dates de evolution dans un format un beaucoup plus nice
// code purement pour l'esthetique du chart donc je me suis permi bcp d'aide
function formatterDatesEvolution(evolution: Evolution, dateDebut: string): Evolution {
  const debut = new Date(dateDebut);
  const fin = new Date();
  // Générer toutes les dates AAAA-MM-JJ
  const toutesLesDates: string[] = [];
  let d = new Date(debut);
  while (d <= fin) {
    toutesLesDates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  // Fonction interne pour nettoyer un metric
  function nettoyerSerie(serie: DateScore[]): DateScore[] {
    const first = serie.findIndex(e => e.score !== null);
    const last = serie.map(e => e.score !== null).lastIndexOf(true);
    // Si aucune valeur non-null → retourner la série complète
    if (first === -1 || last === -1) return serie;
    // Garder les null au milieu, mais couper ceux au début et à la fin
    return serie.slice(first, last + 1);
  }
  const evolutionComplete: Evolution = {
    humeur: [],
    energie: [],
    sommeil: [],
    anxiete: []
  };
  // Transformer + nettoyer chaque metric
  (Object.keys(evolution) as (keyof Evolution)[]).forEach(metric => {
    const arr = evolution[metric];
    const map = new Map(
      arr.map((e: DateScore) => [e.date.slice(0, 10), e.score])
    );
    const remplie: DateScore[] = toutesLesDates.map(date => ({
      date,
      score: map.get(date) ?? null
    }));
    evolutionComplete[metric] = nettoyerSerie(remplie);
  });
  return evolutionComplete;
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


useEffect(() => {
  if (!stats) return;
  const evo = formatterDatesEvolution(stats.evolution, stats.dateDebut);
  setEvolution(evo);
  setMoyennes(stats.moyennes);
}, [stats]);

useEffect(() => {
  getStats(`${jours}d`)
}, [jours])

useEffect(() => {
  getStats("30");
}, []);

// console.log(evolution)
// console.log(stats?.moyennes)

  return (

    
    <div className="container-analyses">
        <h2>Analyses</h2>

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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  key={evolution?.humeur?.length || 0}
                  data={evolution?.humeur}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" interval="preserveStartEnd" stroke="var(--color-text-3)" />
                  
                  <YAxis domain={[0, 5.5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="var(--color-text-3)" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="linear"
                    dataKey="score"
                    stroke="red"
                    connectNulls={true}
                    dot={{ fill: 'var(--color-surface-base)' }}
                    activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                  />
                  {/* {metrics?.map(metric => (
                    <line>
                      type="linear"
                      dataKey="{}"
                      connectNulls={true}
                      dot={{ fill: 'var(--color-surface-base)' }}
                      activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                    </line>
                  ))} */}
                </LineChart>
              </ResponsiveContainer>
            </div>


          </div>  
          



        </div>
    </div>
  );
}
