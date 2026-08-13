import { AI_RESPONSES } from '../data'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const aiTutorService = {
  async send(message) {
    await delay(500 + Math.random() * 500)
    const l = message.toLowerCase()
    if (l.includes('gene')) return AI_RESPONSES[0]
    if (l.includes('base') || l.includes('pair') || l.includes('adenine')) return AI_RESPONSES[1]
    if (l.includes('blueprint') || l.includes('analogy') || l.includes('explain')) return AI_RESPONSES[2]
    if (l.includes('mutation')) return AI_RESPONSES[3]
    if (l.includes('helix') || l.includes('structure') || l.includes('ladder')) return AI_RESPONSES[4]
    if (l.includes('transcri') || l.includes('translat') || l.includes('expression')) return AI_RESPONSES[5]
    return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
  }
}
