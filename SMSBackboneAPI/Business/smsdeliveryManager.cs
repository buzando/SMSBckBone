using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contract.Other;
using Contract.Response;
using Modal;
using Modal.Model.Model;

namespace Business
{
    public class smsdeliveryManager
    {
        public List<fullcampaign> FullResponseCampaignstarted()
        {
            var response = new List<fullcampaign>();
            try
            {
                var now = DateTime.Now;
                using (var ctx = new Entities())
                {
                    response = ctx.Campaigns
                       .Where(c => c.AutoStart == true)
    //                    &&
    //ctx.CampaignSchedules.Any(s =>
    //    s.CampaignId == c.Id &&
    //    s.StartDateTime <= now &&
    //    s.EndDateTime >= now))
                        .Select(c => new fullcampaign
                        {
                            Id = c.Id,
                            Name = c.Name,
                            Message = c.Message,
                            UseTemplate = c.UseTemplate,
                            TemplateId = c.TemplateId,
                            AutoStart = c.AutoStart,
                            FlashMessage = c.FlashMessage,
                            CustomANI = c.CustomANI,
                            RecycleRecords = c.RecycleRecords,
                            NumberType = c.NumberType,
                            CreatedDate = c.CreatedDate,

                            Schedules = ctx.CampaignSchedules
                                .Where(s => s.CampaignId == c.Id).ToList(),

                            RecycleSetting = ctx.CampaignRecycleSettings
                                .Where(r => r.CampaignId == c.Id).FirstOrDefault(),

                            Contacts = ctx.CampaignContacts
                                .Where(cc => cc.CampaignId == c.Id).ToList(),

                        })
                        .ToList();
                }


                return response;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public bool SimulateSmsDispatch()
        {
            try
            {
                var campaigns = FullResponseCampaignstarted();
                var rnd = new Random();

                using (var ctx = new Entities())
                {
                    foreach (var campaign in campaigns)
                    {
                        foreach (var contact in campaign.Contacts)
                        {
                            var schedules = campaign.Schedules.OrderBy(_ => rnd.Next()).FirstOrDefault();
                            // Verifica si ya se envió algo a este contacto
                            bool alreadySentInThisSchedule = ctx.CampaignContactScheduleSend.Any(x =>
    x.ContactId == contact.Id &&
    x.ScheduleId == schedules.Id
);
                            if (alreadySentInThisSchedule) continue;

                            // Obtiene un horario activo aleatorio de la campaña
                            var schedule = campaign.Schedules.OrderBy(_ => rnd.Next()).FirstOrDefault();
                            if (schedule == null) continue;

                            // Simulación de mensaje enviado con posibles respuestas
                            var simulatedResponses = new[]
{
    "OK",
    "espera por respuesta",
    "falla de entrega",
    "rechazo por operador",
    "error en carrier",
    "excepcion del sistema",
    "" // sin respuesta
};

                            string response = simulatedResponses[rnd.Next(simulatedResponses.Length)];
                            bool includeResponseMessage = rnd.NextDouble() < 0.3;
                            string status = response switch
                            {
                                "falla de entrega" => "Error",
                                "rechazo por operador" => "Rechazo",
                                "error en carrier" => "Carrier",
                                "excepcion del sistema" => "Excepcion",
                                _ => "Enviado"
                            };
                            ctx.CampaignContactScheduleSend.Add(new CampaignContactScheduleSend
                            {
                                CampaignId = campaign.Id,
                                ContactId = contact.Id, // o contact.DatoId si aplica
                                ScheduleId = schedule.Id,
                                SentAt = DateTime.Now,
                                Status = status,
                                ResponseMessage = includeResponseMessage ? response : null
                            });
                        }

                        ctx.SaveChanges();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                // Loggear error si se requiere
                Console.WriteLine($"Error en simulación de SMS: {ex.Message}");
                return false;
            }
        }

    }
}
