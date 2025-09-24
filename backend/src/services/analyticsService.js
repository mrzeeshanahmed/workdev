// Minimal analytics service stub
export function emit(eventName, payload = {}) {
  // In real production send to analytics pipeline; here we log for visibility
  console.log('[analytics] event=', eventName, payload)
}
