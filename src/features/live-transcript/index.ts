export { default as LiveTranscript } from './ui/LiveTranscript.vue'
export {
  createTranscriptReducer,
  emptyTranscript,
  speakerColor,
  speakerLabel,
} from './lib/transcript-model'
export type {
  TranscriptState,
  TranscriptTurn,
} from './lib/transcript-model'
