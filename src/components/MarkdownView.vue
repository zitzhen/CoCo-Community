<template>
  <div
    class="markdown-body"
    v-html="rendered"
    @click="onClick"
  ></div>
</template>

<script setup>
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  content: { type: String, default: '' },
})

const rendered = computed(() => renderMarkdown(props.content))

function fallbackCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let success = false
  try {
    success = document.execCommand('copy')
  } catch {}
  document.body.removeChild(textarea)
  return success
}

async function onClick(event) {
  const button = event.target?.closest?.('.copy-code-btn')
  if (!button || !event.currentTarget.contains(button)) return

  const block = button.closest('.code-block')
  const code = block?.querySelector('code')?.textContent || ''
  const originalLabel = button.innerHTML

  let copied = false
  try {
    await navigator.clipboard.writeText(code)
    copied = true
  } catch {
    copied = fallbackCopy(code)
  }

  if (copied) {
    button.classList.add('copied')
    button.innerHTML =
      '<i class="fas fa-check" aria-hidden="true"></i> 已复制'
    setTimeout(() => {
      button.classList.remove('copied')
      button.innerHTML = originalLabel
    }, 1600)
  }
}
</script>
