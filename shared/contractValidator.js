/**
 * Contract Validator
 *
 * Intercepte tous les emit du bus singleton et vérifie que le payload
 * respecte le contrat AVANT de le laisser passer.
 *
 * - Si le payload est valide → l'event passe normalement.
 * - Si le payload est invalide → l'event est BLOQUÉ et un message
 *   [CONTRACT VIOLATION] explicite est affiché en console.
 *
 * Activation : appeler installContractValidator() une seule fois au démarrage
 *              du shell (le bus étant un singleton, ça profite à tous les MFEs).
 *
 *   import { installContractValidator } from 'shared/contractValidator';
 *   installContractValidator();
 */

import eventBus from './eventBus';

const CONTRACTS = {
  'cart:add': {
    id: 'number',
    name: 'string',
    price: 'number',
    image: 'string',
  },
  'cart:updated': {
    items: 'object',
    count: 'number',
    total: 'number',
  },
  'cart:clear': {
    timestamp: 'number',
  },
};

function validate(event, payload) {
  const schema = CONTRACTS[event];
  if (!schema) return { valid: true };

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

export function installContractValidator() {
  if (typeof window !== 'undefined' && window.__CONTRACT_VALIDATOR_INSTALLED__) {
    return;
  }
  if (typeof window !== 'undefined') {
    window.__CONTRACT_VALIDATOR_INSTALLED__ = true;
  }

  const originalEmit = eventBus.emit.bind(eventBus);

  eventBus.emit = function (event, payload) {
    const { valid, reason } = validate(event, payload);
    if (!valid) {
      console.error(`[CONTRACT VIOLATION] ${event} — ${reason}`);
      return;
    }
    originalEmit(event, payload);
  };

  console.log('[ContractValidator] installé — surveille', Object.keys(CONTRACTS).join(', '));
}

export default installContractValidator;
