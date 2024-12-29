from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import librosa
import torch

# Load pre-trained Persian ASR model from Hugging Face
MODEL_NAME = "m3hrdadfi/wav2vec2-large-xlsr-persian"
processor = Wav2Vec2Processor.from_pretrained(MODEL_NAME)
model = Wav2Vec2ForCTC.from_pretrained(MODEL_NAME)

# Function to transcribe audio
def transcribe_audio(file_path, target_words):
    # Load audio file
    audio, rate = librosa.load(file_path, sr=16000)
    input_values = processor(audio, return_tensors="pt", sampling_rate=16000).input_values

    # Perform inference
    with torch.no_grad():
        logits = model(input_values).logits

    # Decode transcription
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.decode(predicted_ids[0])

    print(f"Transcription: {transcription}")

    # Check for target words
    words_found = [word for word in target_words if word in transcription]
    return words_found

# Example usage
audio_file_path = "download.wav"  # Replace with your audio file path
specific_words = ['دعوا','تصادف','کمک',"آخ", "آه", "آی"]  # Replace with the words you want to detect

detected_words = transcribe_audio(audio_file_path, specific_words)

if detected_words:
    print(f"Detected words: {', '.join(detected_words)}")
else:
    print("No target words detected.")