using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MediSync.Services;
using Microsoft.Extensions.Configuration;

namespace MediSync.Functions
{
    public class SpeechProcessing
    {
        private readonly SpeechService _speechService;

        public SpeechProcessing(IConfiguration config)
        {
            _speechService = new SpeechService(config);
        }

        [FunctionName("TranscribeSpeech")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "speech/transcribe")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Processing speech transcription request");

            try
            {
                if (!req.Body.CanSeek)
                {
                    // Create a copy of the request body that can seek
                    var memoryStream = new MemoryStream();
                    await req.Body.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;

                    // Transcribe the audio
                    var transcription = await _speechService.TranscribeAudioAsync(memoryStream);
                    return new OkObjectResult(new { transcription });
                }
                else
                {
                    var transcription = await _speechService.TranscribeAudioAsync(req.Body);
                    return new OkObjectResult(new { transcription });
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Error processing speech: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }
    }
}