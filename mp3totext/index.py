import assemblyai as aai

aai.settings.api_key = "eb8b27c1fb4648ab9ae5f5183a62a520"

FILE_URL = "rec3.wav  "

config = aai.TranscriptionConfig(speaker_labels=True)

transcriber = aai.Transcriber()
transcript = transcriber.transcribe(
  FILE_URL,
  config=config
)

for utterance in transcript.utterances:
  print(f"Speaker {utterance.speaker}: {utterance.text}")