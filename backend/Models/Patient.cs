using System;
using Newtonsoft.Json;

namespace MediSync.Models
{
    public class Patient
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("firstName")]
        public string FirstName { get; set; }
        
        [JsonProperty("lastName")]
        public string LastName { get; set; }
        
        [JsonProperty("dateOfBirth")]
        public DateTime DateOfBirth { get; set; }
        
        [JsonProperty("gender")]
        public string Gender { get; set; }
        
        [JsonProperty("mrn")]
        public string MedicalRecordNumber { get; set; }
        
        [JsonProperty("lastVisit")]
        public DateTime? LastVisit { get; set; }
        
        [JsonProperty("medicalConditions")]
        public string[] MedicalConditions { get; set; }
        
        [JsonProperty("medications")]
        public string[] Medications { get; set; }
    }
}