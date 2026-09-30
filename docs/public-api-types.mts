// Objectif : vérifier que les types publics sont importables.
import { migrationCase, assessCopperMigration } from "../src/index.mjs";
const dossier = migrationCase({
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
});
void assessCopperMigration(dossier, { decide: async () => ({}) });
