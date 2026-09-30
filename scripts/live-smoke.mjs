// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { assessCopperMigration } from "../src/index.mjs";
const client = createJevClient();
const résultat = await assessCopperMigration({
  "id": "exemple-1",
  "text": "Immeuble encore raccordé au cuivre ; fibre disponible dans la rue mais convention syndic absente.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
