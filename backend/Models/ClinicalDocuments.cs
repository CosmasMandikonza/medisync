using System;
using Newtonsoft.Json;

namespace MediSync.Models
{
    public class ClinicalDocument
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("patientId")]
        public string PatientId { get; set; }
        
        [JsonProperty("providerId")]
        public string ProviderId { get; set; }
        
        [JsonProperty("documentType")]
        public string DocumentType { get; set; }
        
        [JsonProperty("content")]
        public string Content { get; set; }
        
        [JsonProperty("generatedContent")]
        public string GeneratedContent { get; set; }
        
        [JsonProperty("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [JsonProperty("status")]
        public string Status { get; set; }
    }
}