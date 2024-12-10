import { onMounted, onUnmounted } from 'vue'

let shortcuts: Record<string, { selector: string; command: (element: Element) => void }> = {}

export default function useHoverShortcut(
  commands: Record<string, { selector: string; command: (element: Element) => void }>,
) {
  shortcuts = { ...shortcuts, ...commands }
  onMounted(() => window.addEventListener('keydown', keydownListener))
  onUnmounted(() => {
    window.addEventListener('keydown', keydownListener)
    shortcuts = {}
  })
}

function keydownListener(event: KeyboardEvent) {
  if (event.altKey) {
    if (shortcuts[event.code]) {
      const element = document.querySelector(`${shortcuts[event.code].selector}:hover`)
      if (element) {
        shortcuts[event.code].command(element)
      }
    }
  }
}
