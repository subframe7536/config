export function getRegistry(env: NodeJS.ProcessEnv = process.env): string {
  return (
    env.npm_config_registry ||
    env.NPM_CONFIG_REGISTRY ||
    'https://registry.npmjs.org'
  ).replace(/\/+$/, '')
}

export async function getLatestVersion(name: string, registry: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const response = await fetch(`${registry}/${encodeURIComponent(name)}`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const metadata = (await response.json()) as { 'dist-tags'?: { latest?: unknown } }
    const version = metadata['dist-tags']?.latest
    if (typeof version !== 'string' || !version.trim()) {
      throw new Error('missing dist-tags.latest')
    }
    return version.trim()
  } finally {
    clearTimeout(timeout)
  }
}
