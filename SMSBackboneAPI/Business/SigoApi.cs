using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Business
{
    public class SigoApi
    {
        public async Task<string> ObtenerTokenAsync()
        {
            using var client = new HttpClient();

            var url = "https://services.siigo.com.mx/api/v1/auth"; // Ejemplo del endpoint
            var payload = new
            {
                username = "partners@nuxiba.com",
                password = "ODQ3YTAxYzEtNDRiMy00NjNmLWI1YTc...etc"
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Error al autenticar: {response.StatusCode}");

            var json = await response.Content.ReadAsStringAsync();
            dynamic result = JsonConvert.DeserializeObject(json);
            return result.access_token;
        }
        public async Task<string> ObtenerFacturasAsync(string token)
        {
            using var client = new HttpClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var url = "https://services.siigo.com.mx/api/v1/invoices"; // Ejemplo de endpoint real

            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Error al obtener facturas: {response.StatusCode}");

            return await response.Content.ReadAsStringAsync();
        }
    }
}
