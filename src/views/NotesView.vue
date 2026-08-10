<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoteForm from '@/components/NoteForm.vue'
import { createNote, deleteNote, fetchNotes, updateNote } from '@/lib/notes'
import type { Note, NoteInput } from '@/types/notes.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import {
  VueSpinnerBall

} from 'vue3-spinners';
const queryClient = useQueryClient()
const editingNote = ref<Note | null>(null)

const {
  data: notes,
  isPending,
  isError,
  error,
} = useQuery({
  queryKey: ['notes'],
  queryFn: fetchNotes,
})

const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
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

function startEdit(note:Note){
  editingNote.value=note
}

function cancelEdit(){
  editingNote.value=null
}
function handleDelete(id:string){
  deleteMutation.mutate(id)
}

</script>


<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">VueNotes AI</h1>
    <NoteForm :editing-notes="editingNote" @submit="handleSubmit" @cancel="cancelEdit"/>

    <div class="mt-8">
      
      <LoadingSpinner v-if="isPending"/>
      <p v-else-if="isError" class="text-red-500 text-sm ">
        Error loading notes : {{ error?.message }}
      </p>
      <p v-else-if="notes?.length===0" class="text-gray-500 text-sm text-center">
        No notes yet. Add your First one above.
      </p>
    </div>
  </div>
</template>