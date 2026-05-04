/**
 * Test de contrat manuel (bonus +1.5b)
 *
 * Vérifie que le payload de cart:add contient bien les champs
 *   { id, name, price, image }
 * avec les bons types (number, string, number, string).
 *
 * Lancement :
 *   node contract.test.js
 *
 * Code de sortie : 0 si tous les tests passent, 1 sinon.
 */

const SCHEMA_CART_ADD = {
  id: 'number',
  name: 'string',
  price: 'number',
  image: 'string',
};

function validate(payload, schema) {
  if (payload === null || typeof payload !== 'object') {
    return { valid: false, reason: "payload n'est pas un objet" };
  }
  for (const [field, expectedType] of Object.entries(schema)) {
    const actual = payload[field];
    if (typeof actual !== expectedType) {
      return {
        valid: false,
        reason: `champ '${field}' manquant ou mauvais type (attendu: ${expectedType}, reçu: ${typeof actual})`,
      };
    }
  }
  return { valid: true };
}

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  \x1b[32mOK\x1b[0m  ${label}`);
    passed++;
  } else {
    console.log(`  \x1b[31mFAIL\x1b[0m ${label}`);
    failed++;
  }
}

console.log('Test contract: cart:add\n');

// Cas 1 — payload valide
const validPayload = { id: 1, name: 'Manette SNES', price: 29, image: 'snes' };
const r1 = validate(validPayload, SCHEMA_CART_ADD);
assert(r1.valid, 'payload valide accepté');

// Cas 2 — champ price manquant
const missingPrice = { id: 1, name: 'Manette SNES', image: 'snes' };
const r2 = validate(missingPrice, SCHEMA_CART_ADD);
assert(!r2.valid && r2.reason.includes('price'), `payload sans 'price' rejeté → ${r2.reason}`);

// Cas 3 — id en string au lieu de number
const wrongIdType = { id: '1', name: 'Manette SNES', price: 29, image: 'snes' };
const r3 = validate(wrongIdType, SCHEMA_CART_ADD);
assert(!r3.valid && r3.reason.includes('id'), `payload avec id en string rejeté → ${r3.reason}`);

// Cas 4 — payload null
const r4 = validate(null, SCHEMA_CART_ADD);
assert(!r4.valid, `payload null rejeté → ${r4.reason}`);

// Cas 5 — payload avec champ supplémentaire (category) → doit passer (extras autorisés)
const withExtras = { id: 1, name: 'Manette SNES', price: 29, image: 'snes', category: 'manettes' };
const r5 = validate(withExtras, SCHEMA_CART_ADD);
assert(r5.valid, 'payload avec champ supplémentaire accepté (extras tolérés)');

console.log(`\n${passed} passé(s), ${failed} échoué(s)`);
process.exit(failed > 0 ? 1 : 0);
