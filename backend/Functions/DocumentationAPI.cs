using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MediSync.Services;
using Microsoft.Extensions.Configuration;
using MediSync.Models;

namespace MediSync.Functions
{
    public class DocumentationAPI
    {
        private readonly OpenAIService _openAIService;

        public DocumentationAPI(IConfiguration config)
        {
            _openAIService = new OpenAIService(config);
        }

        [FunctionName("GenerateNote")]
        public async Task<IActionResult> GenerateNote(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "documentation/generate")] HttpRequest req,
            [CosmosDB(
                databaseName: "MediSyncDB",
                containerName: "Documents",
                Connection = "CosmosDB_Connection")] IAsyncCollector<ClinicalDocument> documentsOut,
            ILogger log)
        {
            log.LogInformation("Processing note generation request");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var data = JsonConvert.DeserializeObject<dynamic>(requestBody);
                
                string transcription = data.transcription;
                string patientId = data.patientId;
                string patientContext = data.patientContext;
                string providerId = data.providerId;

                var generatedNote = await _openAIService.GenerateClinicalNoteAsync(transcription, patientContext);

                var document = new ClinicalDocument
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = patientId,
                    ProviderId = providerId,
                    DocumentType = "Clinical Note",
                    Content = transcription,
                    GeneratedContent = generatedNote,
                    CreatedAt = DateTime.UtcNow,
                    Status = "Draft"
                };

                await documentsOut.AddAsync(document);

                return new OkObjectResult(new { document });
            }
            catch (Exception ex)
            {
                log.LogError($"Error generating note: {ex.Message}");
                return new StatusCodeResult(500);
            }
        }
    }
}