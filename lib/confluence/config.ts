function env(name: string) {
  return process.env[name]?.trim() || ""
}

export type ConfluenceConfig = {
  email: string
  token: string
  site: string
  spaceId: string
  parentTitle: string
  analysisParentTitle: string
  productPageId: string
}

export function getConfluenceConfig(): ConfluenceConfig {
  return {
    email: env("ATLASSIAN_EMAIL"),
    token: env("ATLASSIAN_API_TOKEN"),
    site: env("CONFLUENCE_SITE"),
    spaceId: env("CONFLUENCE_SPACE_ID"),
    parentTitle: env("CONFLUENCE_PARENT_TITLE") || "Reuniones",
    analysisParentTitle: env("CONFLUENCE_ANALYSIS_PARENT_TITLE") || "Análisis de llamadas",
    productPageId: env("CONFLUENCE_PRODUCT_PAGE_ID") || "5013514",
  }
}

export function isConfluenceConfigured() {
  const config = getConfluenceConfig()
  return Boolean(config.email && config.token && config.site && config.spaceId)
}
