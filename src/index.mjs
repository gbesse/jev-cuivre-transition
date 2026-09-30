// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";

export const DECISIONS = Object.freeze({
  "ready": "prêt",
  "needs_support": "accompagnement_nécessaire",
  "blocked": "bloqué",
  "not_applicable": "sans_objet"
});
const CRITERIA = Object.freeze({
  "ready": "prêt",
  "needs_support": "accompagnement nécessaire",
  "blocked": "bloqué",
  "not_applicable": "sans objet"
});

export function migrationCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}

export async function assessCopperMigration(input, provider) {
  const record = migrationCase(input);
  if (record.buildingHasCopper === false) return { decision: "not_applicable", label: DECISIONS["not_applicable"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce situation de migration à partir des seuls éléments sourcés. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni éligibilité, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}

export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-cuivre-transition <dossier.json>");
  const record = migrationCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier: record, prochaineÉtape: "Transmettez ce dossier à assessCopperMigration avec un fournisseur Jev configuré." }, null, 2));
}
