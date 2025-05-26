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
                       .Where(c => c.AutoStart == true
                                            &&
                        ctx.CampaignSchedules.Any(s =>
                            s.CampaignId == c.Id &&
                            s.StartDateTime <= now &&
                            s.EndDateTime >= now))
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
                            if (schedules == null) continue;

                            bool alreadySentInThisSchedule = ctx.CampaignContactScheduleSend.Any(x =>
                                x.ContactId == contact.Id && x.ScheduleId == schedules.Id);

                            if (alreadySentInThisSchedule) continue;

                            int responseNumber = rnd.Next(0, 6);

                            var lada = contact.PhoneNumber.Substring(0, 2); // primero intentamos con 2 dígitos
                            var ladaRecord = ctx.IFTLadas.FirstOrDefault(l => l.ClaveLada == lada);

                            if (ladaRecord == null && contact.PhoneNumber.Length >= 3)
                            {
                                lada = contact.PhoneNumber.Substring(0, 3); // probamos con 3 dígitos
                                ladaRecord = ctx.IFTLadas.FirstOrDefault(l => l.ClaveLada == lada);
                            }

                            string estado = ladaRecord != null ? ladaRecord.Estado : "Desconocido";

                            ctx.CampaignContactScheduleSend.Add(new CampaignContactScheduleSend
                            {
                                CampaignId = campaign.Id,
                                ContactId = contact.Id,
                                ScheduleId = schedules.Id,
                                SentAt = DateTime.Now,
                                Status = responseNumber.ToString(),
                                ResponseMessage = null,
                                State = estado
                            });
                        }

                        ctx.SaveChanges();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
