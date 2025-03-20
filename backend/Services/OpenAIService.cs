using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace MediSync.Services
{
    public class OpenAIService
    {
        private readonly string endpoint;
        private readonly string key;
        private readonly HttpClient client;

        public OpenAIService(IConfiguration config)
        {
            endpoint = config["OpenAI_Endpoint"];
            key = config["OpenAI_Key"];
            client = new HttpClient();
            client.DefaultRequestHeaders.Add("api-key", key);
        }

        public async Task<string> GenerateClinicalNoteAsync(string transcription, string patientContext)
        {
            var requestBody = new
            {
                messages = new[]
                {
                    new { role = "system", content = "You are a medical documentation assistant. Format clinical notes professionally based on the transcription. Include sections for Subjective, Objective, Assessment, and Plan." },
                    new { role = "user", content = $"Patient context: {patientContext}\n\nTranscription: {transcription}" }
                },
                max_tokens = 800,
                temperature = 0.7
            };

            var requestJson = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"{endpoint}/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-05-15", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseObject = JsonConvert.DeserializeObject<dynamic>(responseContent);

            return responseObject.choices[0].message.content.ToString();
        }
    }
}