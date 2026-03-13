export default async function handler(req, res) {
  const { filterByFormula, sort0Field, sort0Dir, sort1Field, sort1Dir } = req.query;
  
  // Recuperiamo il Token dalla cassaforte di Vercel
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE_ID = "app2OOGt6jSMm5JAc"; // Il tuo ID Base
  const TABLE_NAME = "Messe"; 

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterByFormula)}&sort[0][field]=${sort0Field}&sort[0][direction]=${sort0Dir}&sort[1][field]=${sort1Field}&sort[1][direction]=${sort1Dir}`;

  try {
    const risposta = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const dati = await risposta.json();
    
    // CONFIGURAZIONE CACHE:
    // s-maxage=3600: Vercel tiene i dati "freschi" per 1 ora (3600 secondi).
    // stale-while-revalidate=600: Se qualcuno entra dopo l'ora, vede subito i dati vecchi 
    // mentre Vercel scarica quelli nuovi in background (per max 10 minuti).
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    
    res.status(200).json(dati);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dati" });
  }
}

