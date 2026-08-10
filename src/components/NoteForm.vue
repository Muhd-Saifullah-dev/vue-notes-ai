<script setup lang="ts">
import type { Note, NoteInput } from '@/types/notes.type'
import { ref, watch } from 'vue'
const props = defineProps<{
  editingNotes: Note | null
}>()

const emit = defineEmits<{
  submit: [data: NoteInput]
  cancel: []
}>()
const title = ref('')
const content = ref('')

watch(
  () => props.editingNotes,
  (note) => {
    if (note) {
      title.value = note.title
      content.value = note.content ?? ''
    } else {
      title.value = ''
      content.value = ''
    }
  },
  { immediate: true },
)

function handleSubmit() {
  if (!title.value.trim()) return
  emit('submit', {
    title: title.value.trim(),
    content: content.value,
  })
  title.value = ''
  content.value = ''
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col gap-3"
  >
    <input
      v-model="title"
      type="text"
      placeholder="Note title"
      class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <textarea
      v-model="content"
      placeholder="write your notes...."
      rows="4"
      class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
    ></textarea>
    <div class="flex gap-2">
      <button
        type="submit"
        class="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        {{ editingNotes ? 'Save changes' : 'Add Note' }}
      </button>
      <button
        v-if="editingNotes"
        type="button"
        @click="emit('cancel')"
        class="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-3 rounded-md hover:bg-gray-200"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
