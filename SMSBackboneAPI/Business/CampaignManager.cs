using System;
using System.Collections.Generic;
using System.Linq;
using Contract.Response;
using Modal;
using Modal.Model.Model;

namespace Business
{
    public class CampaignManager
    {
        public bool CreateCampaign(Campaigns campaign)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.Campaigns.Add(campaign);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateCampaign(Campaigns campaign)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var existing = ctx.Campaigns.FirstOrDefault(c => c.Id == campaign.Id);
                    if (existing == null) return false;

                    existing.Name = campaign.Name;
                    existing.Message = campaign.Message;
                    existing.UseTemplate = campaign.UseTemplate;
                    existing.TemplateId = campaign.TemplateId;
                    existing.AutoStart = campaign.AutoStart;
                    existing.FlashMessage = campaign.FlashMessage;
                    existing.CustomANI = campaign.CustomANI;
                    existing.RecycleRecords = campaign.RecycleRecords;
                    existing.NumberType = campaign.NumberType;
                    existing.ModifiedDate = DateTime.Now;

                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteCampaign(int campaignId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var campaign = ctx.Campaigns.FirstOrDefault(c => c.Id == campaignId);
                    if (campaign == null) return false;

                    ctx.Campaigns.Remove(campaign);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool AddCampaignContact(CampaignContacts contact)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignContacts.Add(contact);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteCampaignContact(int contactId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var contact = ctx.CampaignContacts.FirstOrDefault(c => c.Id == contactId);
                    if (contact == null) return false;

                    ctx.CampaignContacts.Remove(contact);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool AddRecycleSetting(CampaignRecycleSettings setting)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignRecycleSettings.Add(setting);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteRecycleSetting(int settingId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var setting = ctx.CampaignRecycleSettings.FirstOrDefault(r => r.Id == settingId);
                    if (setting == null) return false;

                    ctx.CampaignRecycleSettings.Remove(setting);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool AddCampaignSchedule(CampaignSchedules schedule)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignSchedules.Add(schedule);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool DeleteCampaignSchedule(int scheduleId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var schedule = ctx.CampaignSchedules.FirstOrDefault(s => s.Id == scheduleId);
                    if (schedule == null) return false;

                    ctx.CampaignSchedules.Remove(schedule);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool AddBlacklistCampaign(blacklistcampains blacklist)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.blacklistcampains.Add(blacklist);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteBlacklistCampaign(int blacklistId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var blacklist = ctx.blacklistcampains.FirstOrDefault(b => b.id == blacklistId);
                    if (blacklist == null) return false;

                    ctx.blacklistcampains.Remove(blacklist);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool InsertBatchFromSession(string sessionId, int campaignId)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var contactosTemporales = ctx.tpm_CampaignContacts
                        .Where(c => c.SessionId == sessionId)
                        .ToList();

                    if (!contactosTemporales.Any())
                        return false;


                    var contactosDefinitivos = contactosTemporales.Select(temp => new CampaignContacts
                    {
                        CampaignId = campaignId,
                        PhoneNumber = temp.PhoneNumber,
                        Dato = temp.Dato,
                        DatoId = temp.DatoId,
                        Misc01 = temp.Misc01,
                        Misc02 = temp.Misc02
                    }).ToList();


                    ctx.CampaignContacts.AddRange(contactosDefinitivos);
                    ctx.SaveChanges();

                    return true;
                }
            }
            catch (Exception ex)
            {
                // Aquí puedes loguear el error si usas algún sistema de logging
                return false;
            }
        }

        public List<CampaignFullResponse> FullResponseCampaignByRoom(int idRoom)
        {
            var response = new List<CampaignFullResponse>();
            try
            {
                using (var ctx = new Entities())
                {
                    response = ctx.Campaigns
                        .Where(c => c.RoomId == idRoom)
                        .Select(c => new CampaignFullResponse
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
                            StartDate = c.StartDate,

                            Schedules = ctx.CampaignSchedules
                                .Where(s => s.CampaignId == c.Id)
                                .Select(s => new CampaignScheduleDto
                                {
                                    StartDateTime = s.StartDateTime,
                                    EndDateTime = s.EndDateTime,
                                    OperationMode = s.OperationMode,
                                    Order = s.Order
                                }).ToList(),

                            RecycleSetting = ctx.CampaignRecycleSettings
                                .Where(r => r.CampaignId == c.Id)
                                .Select(r => new CampaignRecycleSettingDto
                                {
                                    TypeOfRecords = r.TypeOfRecords,
                                    IncludeNotContacted = r.IncludeNotContacted,
                                    NumberOfRecycles = r.NumberOfRecycles
                                }).FirstOrDefault(),

                            Contacts = ctx.CampaignContacts
                                .Where(cc => cc.CampaignId == c.Id)
                                .Select(cc => new CampaignContactDto
                                {
                                    PhoneNumber = cc.PhoneNumber,
                                    Dato = cc.Dato,
                                    DatoId = cc.DatoId,
                                    Misc01 = cc.Misc01,
                                    Misc02 = cc.Misc02
                                }).ToList(),

                            CampaignContactScheduleSendDTO = ctx.CampaignContactScheduleSend
    .Where(s => s.CampaignId == c.Id)
    .Select(s => new CampaignContactScheduleSendDTO
    {
        ContactId = s.ContactId,
        ScheduleId = s.ScheduleId,
        SentAt = s.SentAt,
        Status = s.Status,
        ResponseMessage = s.ResponseMessage
    }).ToList()
                        })
                        .ToList();
                }

                foreach (var c in response)
                {
                    var duplicado = c.Schedules.Where(s => s.OperationMode == 2 && s.StartDateTime <= DateTime.Now).ToList();
                    c.numeroInicial = duplicado.Count() > 1 ? c.Contacts.Count * duplicado.Count() : c.Contacts.Count;
                    c.numeroActual = c.CampaignContactScheduleSendDTO.Count;

                    c.RespondedRecords = c.CampaignContactScheduleSendDTO
                        .Count(x => !string.IsNullOrEmpty(x.ResponseMessage));

                    c.OutOfScheduleRecords = c.CampaignContactScheduleSendDTO
                        .Count(x => x.Status.ToLower() == "fuera");

                    c.BlockedRecords = c.CampaignContactScheduleSendDTO
                        .Count(x => x.Status.ToLower() == "block");
                    c.RecycleCount = c.Schedules.Count(s => s.OperationMode == 2);

                    int total = c.numeroInicial;

                    int recibidos = c.CampaignContactScheduleSendDTO
                        .Count(x => !string.IsNullOrEmpty(x.ResponseMessage) && x.Status.ToLower() != ("error"));

                    int espera = c.CampaignContactScheduleSendDTO
                        .Count(x => x.ResponseMessage == null && x.Status.ToLower() == ("espera"));

                    int fallaEntrega = c.CampaignContactScheduleSendDTO
                        .Count(x => x.ResponseMessage == null && x.Status.ToLower() == ("falla"));

                    int rechazo = c.CampaignContactScheduleSendDTO
                        .Count(x => x.ResponseMessage == null && x.Status.ToLower() == ("rechazo"));

                    int errorCarrier = c.CampaignContactScheduleSendDTO
                        .Count(x => x.ResponseMessage == null && x.Status.ToLower() == ("carrier"));

                    int excepcion = c.CampaignContactScheduleSendDTO
                        .Count(x => x.ResponseMessage == null && x.Status.ToLower() == ("excepcion"));

                    int fuera = c.CampaignContactScheduleSendDTO.Count(x => x.Status == "Fuera");
                    int bloqueado = c.CampaignContactScheduleSendDTO.Count(x => x.Status == "Block");

                    int totalClasificados = recibidos + espera + fallaEntrega + rechazo + errorCarrier + excepcion + fuera + bloqueado;
                    int noRecibidos = Math.Max(0, total - totalClasificados);


                    c.ReceptionRate = recibidos;
                    c.WaitRate = espera;
                    c.DeliveryFailRate = fallaEntrega;
                    c.RejectionRate = rechazo;
                    c.NoSendRate = errorCarrier;
                    c.ExceptionRate = excepcion;
                    c.NoReceptionRate = noRecibidos;

                }

                return response;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public bool StartCampaign(int IdCampaign)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var campaign = ctx.Campaigns.Where(x => x.Id == IdCampaign).FirstOrDefault();
                    campaign.AutoStart = campaign.AutoStart ? false : true;
                    if (campaign.AutoStart)
                    {
                        campaign.StartDate = DateTime.Now;
                    }
                    ctx.SaveChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool DeleteCampaignsCascade(List<int> campaignIds)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    foreach (var campaignId in campaignIds)
                    {
                        var campaign = ctx.Campaigns.FirstOrDefault(c => c.Id == campaignId);
                        if (campaign == null) continue;

                        var contacts = ctx.CampaignContacts.Where(c => c.CampaignId == campaignId).ToList();
                        ctx.CampaignContacts.RemoveRange(contacts);

                        var schedules = ctx.CampaignSchedules.Where(s => s.CampaignId == campaignId).ToList();
                        ctx.CampaignSchedules.RemoveRange(schedules);

                        var recycle = ctx.CampaignRecycleSettings.Where(r => r.CampaignId == campaignId).ToList();
                        ctx.CampaignRecycleSettings.RemoveRange(recycle);

                        var blacklist = ctx.blacklistcampains.Where(b => b.idcampains == campaignId).ToList();
                        ctx.blacklistcampains.RemoveRange(blacklist);

                        var sentRecords = ctx.CampaignContactScheduleSend.Where(s => s.CampaignId == campaignId).ToList();
                        ctx.CampaignContactScheduleSend.RemoveRange(sentRecords);

                        ctx.Campaigns.Remove(campaign);
                    }

                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }


    }
}
