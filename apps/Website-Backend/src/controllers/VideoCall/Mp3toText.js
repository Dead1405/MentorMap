import { post, get } from 'axios';
import { createReadStream } from 'fs';
import FormData from 'form-data';

const API_KEY = "eb8b27c1fb4648ab9ae5f5183a62a520";
const FILE_PATH = "rec3.wav";  // Replace this with the path to your audio file

// Function to upload the audio file and get its URL
async function uploadAudio() {
  const form = new FormData();
  form.append('file', createReadStream(FILE_PATH));

  const uploadResponse = await post('https://api.assemblyai.com/v2/upload', form, {
    headers: {
      'authorization': API_KEY,
      ...form.getHeaders()
    }
  });

  return uploadResponse.data.upload_url;
}

// Function to transcribe the audio with speaker labels
async function transcribeAudio(fileUrl) {
  const response = await post('https://api.assemblyai.com/v2/transcript', {
    audio_url: fileUrl,
    speaker_labels: true
  }, {
    headers: {
      'authorization': API_KEY,
      'content-type': 'application/json'
    }
  });

  return response.data.id;
}

// Function to poll the transcription result
async function getTranscriptionResult(transcriptId) {
  const response = await get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
    headers: {
      'authorization': API_KEY
    }
  });

  return response.data;
}

(async () => {
  try {
    // Step 1: Upload audio and get file URL
    const fileUrl = await uploadAudio();
    console.log('File uploaded:', fileUrl);

    // Step 2: Send the audio URL for transcription with speaker labels
    const transcriptId = await transcribeAudio(fileUrl);
    console.log('Transcription in progress...');

    // Step 3: Poll the transcription result until it's ready
    let transcript;
    while (true) {
      transcript = await getTranscriptionResult(transcriptId);
      if (transcript.status === 'completed') {
        break;
      } else if (transcript.status === 'failed') {
        throw new Error('Transcription failed');
      }
      console.log('Waiting for transcription...');
      await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds before retrying
    }

    // Step 4: Print the transcription with speaker labels
    transcript.utterances.forEach(utterance => {
      console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
})();
