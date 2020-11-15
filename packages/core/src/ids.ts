let fallbackId = 0
export function getId() {
  fallbackId++
  return `generated-esg-strmx-${fallbackId}`
}
