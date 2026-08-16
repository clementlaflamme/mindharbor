import { useEffect, useState } from "react"
import { api } from "../api/api";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function Analyses() {
  // const [tendances, setTendances] = useState<Tendances | null>(null);
  // const [evoHumeur, setEvoHumeur] = useState<DateScore[]>([]);
  // const [evoEnergie, setEvoEnergie] =useState<DateScore[]>([]);
  // const [evoSommeil, setEvoSommeil] =useState<DateScore[]>([]);
  // const [evoAnxiete, setEvoAnxiete] =useState<DateScore[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [evolution, setEvolution] = useState<Evolution | null>(null);
  const [moyennes, setMoyennes] = useState<Moyennes | null>(null);
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

  const toutesLesDates: string[] = [];
  let d = new Date(debut);

  while (d <= fin) {
    toutesLesDates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }

  const evolutionComplete: Evolution = {
    humeur: [],
    energie: [],
    sommeil: [],
    anxiete: []
  };

  (Object.keys(evolution) as (keyof Evolution)[]).forEach(metric => {
    const arr = evolution[metric];

    const map = new Map(
      arr.map((e: DateScore) => [e.date.slice(0, 10), e.score])
    );

    const remplie: DateScore[] = toutesLesDates.map(date => ({
      date,
      score: map.get(date) ?? null
    }));

    evolutionComplete[metric] = remplie;
  });

  return evolutionComplete;
}



useEffect(() => {
  if (!stats) return;
  const evo = formatterDatesEvolution(stats.evolution, stats.dateDebut);
  setEvolution(evo);
  setMoyennes(stats.moyennes);
}, [stats]);


useEffect(() => {
  getStats("15d");
}, []);

console.log(evolution)
// console.log(stats?.moyennes)

  return (

    
    <div className="container-analyses">
        <h2>Écran Analyses</h2>
        <div className="container-graphique">

          <div className="container-graphique-boutons">
            <button>7j.</button>
            <button>30j.</button>
            <button>90j.</button>
          </div>

          <div className="graphique">
            <LineChart>

            </LineChart>
          </div>
        </div>
    </div>
  );
}
