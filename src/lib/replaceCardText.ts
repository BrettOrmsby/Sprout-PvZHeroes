export default function replaceCardText(text: string) {
  return text.replace(/\{\{(.+?)\}\}/g, (item) => {
    const ability = item.slice(2, -2)

    return `<img class="abilityIcon" src="/images/abilities/${ability.toLowerCase()}.png" alt="${ability}"/>`
  })
}
