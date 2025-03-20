using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MediSync.Models;
using System.Collections.Generic;

namespace MediSync.Functions
{
    public static class PatientAPI
    {
        [FunctionName("GetPatients")]
        public static async Task<IActionResult> GetPatients(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "patients")] HttpRequest req,
            [CosmosDB(
                databaseName: "MediSyncDB",
                containerName: "Patients",
                Connection = "CosmosDB_Connection",
                SqlQuery = "SELECT * FROM c")] IEnumerable<Patient> patients,
            ILogger log)
        {
            log.LogInformation("Getting all patients");
            return new OkObjectResult(patients);
        }

        [FunctionName("GetPatientById")]
        public static async Task<IActionResult> GetPatientById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "patients/{id}")] HttpRequest req,
            [CosmosDB(
                databaseName: "MediSyncDB",
                containerName: "Patients",
                Connection = "CosmosDB_Connection",
                Id = "{id}",
                PartitionKey = "{id}")] Patient patient,
            ILogger log,
            string id)
        {
            log.LogInformation($"Getting patient with id: {id}");

            if (patient == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(patient);
        }

        [FunctionName("CreatePatient")]
        public static async Task<IActionResult> CreatePatient(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "patients")] HttpRequest req,
            [CosmosDB(
                databaseName: "MediSyncDB",
                containerName: "Patients",
                Connection = "CosmosDB_Connection")] IAsyncCollector<Patient> patientsOut,
            ILogger log)
        {
            log.LogInformation("Creating a new patient");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var patient = JsonConvert.DeserializeObject<Patient>(requestBody);

            if (string.IsNullOrEmpty(patient.Id))
            {
                patient.Id = Guid.NewGuid().ToString();
            }

            await patientsOut.AddAsync(patient);

            return new OkObjectResult(patient);
        }
    }
}