using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace MediSync.Services
{
    public class VisionService
    {
        private readonly string endpoint;
        private readonly string key;
        private readonly HttpClient client;

        public VisionService(IConfiguration config)
        {
            endpoint = config["Vision_Endpoint"];
            key = config["Vision_Key"];
            client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", key);
        }

        public async Task<string> AnalyzeMedicalImageAsync(Stream imageStream)
        {
            // Convert the stream to bytes
            byte[] imageBytes;
            using (var memoryStream = new MemoryStream())
            {
                await imageStream.CopyToAsync(memoryStream);
                imageBytes = memoryStream.ToArray();
            }

            // Analyze the image
            var requestUrl = $"{endpoint}/vision/v3.2/analyze?visualFeatures=Objects,Tags,Description";

            using var content = new ByteArrayContent(imageBytes);
            content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

            var response = await client.PostAsync(requestUrl, content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            return responseContent;
        }
    }
}