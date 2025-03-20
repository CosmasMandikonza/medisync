using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Configuration;

namespace MediSync.Services
{
    public class SpeechService
    {
        private readonly string speechKey;
        private readonly string speechRegion;

        public SpeechService(IConfiguration config)
        {
            speechKey = config["Speech_Key"];
            speechRegion = config["Speech_Region"];
        }

        public async Task<string> TranscribeAudioAsync(Stream audioStream)
        {
            var speechConfig = SpeechConfig.FromSubscription(speechKey, speechRegion);
            speechConfig.SpeechRecognitionLanguage = "en-US";
            speechConfig.EnableDictation();

            using var audioConfig = AudioConfig.FromStreamInput(audioStream);
            using var speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

            var result = await speechRecognizer.RecognizeOnceAsync();
            return result.Text;
        }
    }
}