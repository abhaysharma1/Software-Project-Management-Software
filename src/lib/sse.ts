type ClientEntry = {
  controller: ReadableStreamDefaultController<string>
  lastActivity: number
}

const clients = new Map<string, Set<ClientEntry>>()

export function addClient(userId: string, controller: ReadableStreamDefaultController<string>) {
  let userClients = clients.get(userId)
  if (!userClients) {
    userClients = new Set()
    clients.set(userId, userClients)
  }
  userClients.add({ controller, lastActivity: Date.now() })
}

export function removeClient(userId: string, controller: ReadableStreamDefaultController<string>) {
  const userClients = clients.get(userId)
  if (!userClients) return
  for (const entry of userClients) {
    if (entry.controller === controller) {
      userClients.delete(entry)
      break
    }
  }
  if (userClients.size === 0) clients.delete(userId)
}

export function pushEvent(userId: string, event: string, data: unknown) {
  const userClients = clients.get(userId)
  if (!userClients) return
  const message = event ? `event: ${event}\ndata: ${JSON.stringify(data)}\n\n` : `data: ${JSON.stringify(data)}\n\n`
  const dead: ClientEntry[] = []
  for (const entry of userClients) {
    try {
      entry.controller.enqueue(message)
      entry.lastActivity = Date.now()
    } catch {
      dead.push(entry)
    }
  }
  for (const entry of dead) {
    userClients.delete(entry)
  }
  if (userClients.size === 0) clients.delete(userId)
}

export function pruneStaleClients(maxAgeMs = 120000) {
  const cutoff = Date.now() - maxAgeMs
  for (const [userId, userClients] of clients) {
    const dead: ClientEntry[] = []
    for (const entry of userClients) {
      if (entry.lastActivity < cutoff) {
        dead.push(entry)
      }
    }
    for (const entry of dead) {
      userClients.delete(entry)
    }
    if (userClients.size === 0) clients.delete(userId)
  }
}

setInterval(() => pruneStaleClients(), 60000)
