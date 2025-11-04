// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  baseUrl: API_URL,
  snapshot: `${API_URL}/snapshot`,
  photos: `${API_URL}/photos`,
  networkInfo: `${API_URL}/network-info`,
  images: `${API_URL}/images`,
  health: `${API_URL}/health`,
}

// Helper function to check API health
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(api.health)
    return response.ok
  } catch {
    return false
  }
}
