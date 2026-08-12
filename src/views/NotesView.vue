<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoteCard from '@/components/NoteCard.vue'
import NoteForm from '@/components/NoteForm.vue'
import { useAuth } from '@/composables/useAuth'
import { createNote, deleteNote, fetchNotes, updateNote } from '@/lib/notes'

import type { Note, NoteInput } from '@/types/notes.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const queryClient = useQueryClient()
const editingNote = ref<Note | null>(null)
const router=useRouter()
const {signOut} =useAuth()



const {
  data: notes,
  isPending,
  isError,
  error,
} = useQuery({
  queryKey: ['notes'],
  queryFn: fetchNotes,
})

console.log('notes', notes)
const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: (data) => {
    console.log('Created note:', data)

    queryClient.invalidateQueries({
      queryKey: ['notes'],
    })
  },
  onError: (error) => {
    console.log('Create error:', error)
  },
})
const updateMutation = useMutation({
  mutationFn: ({ id, input }: { id: string; input: NoteInput }) => updateNote(id, input),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
    editingNote.value = null
  },
})

const deleteMutation = useMutation({
  mutationFn: deleteNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  },
})

function handleSubmit(formData: NoteInput) {
  if (editingNote.value) {
    updateMutation.mutate({ id: editingNote.value.id, input: formData })
  } else {
    createMutation.mutate(formData)
  }
}

function startEdit(note: Note) {
  editingNote.value = note
}

function cancelEdit() {
  editingNote.value = null
}
function handleDelete(id: string) {
  deleteMutation.mutate(id)
}

async function handleSignOut() {
  await signOut()
  router.push("/login")
  
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">VueNotes AI</h1>
      <button @click="handleSignOut" class="text-sm text-gray-500 hover:text-gray-700">Sign Out</button>
    </div>
    
    <NoteForm :editing-notes="editingNote" @submit="handleSubmit" @cancel="cancelEdit" />

    <div class="mt-8">
      <LoadingSpinner v-if="isPending" />
      <p v-else-if="isError" class="text-red-500 text-sm">
        Error loading notes : {{ error?.message }}
      </p>
      <p v-else-if="notes?.length === 0" class="text-gray-500 text-sm text-center">
        No notes yet. Add your First one above.
      </p>

      <div v-else class="flex flex-col gap-4">
        <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @edit="startEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>
