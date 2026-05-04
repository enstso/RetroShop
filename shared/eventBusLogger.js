/**
 * Event Bus Logger - wrapper de debug autour de shared/eventBus.js
 *
 * Chaque MFE crée son propre bus logué en passant son nom :
 *   import { createLoggedBus } from 'shared/eventBusLogger';
 *   const eventBus = createLoggedBus('mfe-cart');
 *
 * Format de log :
 *   [HH:MM:SS] EVENT BUS ↑ event   {payload}        (émission)
 *   [HH:MM:SS] EVENT BUS ↓ event (traité par mfeName)  (réception)
 */

import eventBus from './eventBus';

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function createLoggedBus(mfeName) {
  return {
    emit(event, data) {
      console.log(`[${timestamp()}] EVENT BUS ↑ ${event}`, data);
      eventBus.emit(event, data);
    },

    on(event, callback) {
      const wrapped = (data) => {
        console.log(`[${timestamp()}] EVENT BUS ↓ ${event} (traité par ${mfeName})`);
        callback(data);
      };
      return eventBus.on(event, wrapped);
    },

    off(event, callback) {
      eventBus.off(event, callback);
    },
  };
}

export default createLoggedBus;
