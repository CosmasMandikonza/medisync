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
    public class ImageAnalysis
    {
        private readonly VisionService _visionService;

        public ImageAnalysis(IConfiguration config)
        {
            _visionService = new VisionService(config);
        }

        [FunctionName("AnalyzeImage")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "vision/analyze")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Processing image analysis request");

            try
            {
                if (!req.Body.CanSeek)
                {
                    // Create a copy of the request body that can seek
                    var memoryStream = new MemoryStream();
                    await req.Body.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;

                    // Analyze the image
                    var analysisResult = await _visionService.AnalyzeMedicalImageAsync(memoryStream);
                    return new OkObjectResult(new { analysis = analysisResult });
                }
                else
                {
                    var analysisResult = await _visionService.AnalyzeMedicalImageAsync(req.Body);
                    return new OkObjectResult(new { analysis = analysisResult });
                }
            }
            catch (Exception ex)
            {
                log.LogError($"Error analyzing image: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }
    }
}