from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import AudioFileSerializer
from vosk import Model, KaldiRecognizer
import wave

# Initialize Vosk model (download and place in your project directory)
model = Model("model")

class AudioFileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = AudioFileSerializer(data=request.data)
        if serializer.is_valid():
            # Process the WAV file for speech recognition
            file = request.FILES['audio_file']
            with wave.open(file, 'rb') as wf:
                if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != 'NONE':
                    return Response({'error': 'Audio file must be WAV format mono PCM.'}, status=status.HTTP_400_BAD_REQUEST)

                recognizer = KaldiRecognizer(model, wf.getframerate())
                transcription = []

                while True:
                    data = wf.readframes(4000)
                    if len(data) == 0:
                        break
                    if recognizer.AcceptWaveform(data):
                        result = recognizer.Result()
                        transcription.append(result)

                final_result = recognizer.FinalResult()
                transcription.append(final_result)

            return Response({'transcription': transcription}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
