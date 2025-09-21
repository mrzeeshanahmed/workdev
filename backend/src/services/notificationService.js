// Placeholder notification service for saved-search matches
export function notifyDeveloper(developerId, message) {
  // In MVP, just log or push to analytics
  // Real implementation would enqueue email/push notifications
  console.log(`[notification] to=${developerId} message=${message}`)
}

export default { notifyDeveloper }
