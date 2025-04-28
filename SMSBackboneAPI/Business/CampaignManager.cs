using System;
using System.Collections.Generic;
using System.Linq;
using Modal;
using Modal.Model.Model;

namespace Business
{
    public class CampaignManager
    {
        // CRUD para Campaigns
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

        // CRUD para CampaignContact
        public bool AddCampaignContact(CampaignContact contact)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignContact.Add(contact);
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
                    var contact = ctx.CampaignContact.FirstOrDefault(c => c.Id == contactId);
                    if (contact == null) return false;

                    ctx.CampaignContact.Remove(contact);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        // CRUD para CampaignRecycleSetting
        public bool AddRecycleSetting(CampaignRecycleSetting setting)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignRecycleSetting.Add(setting);
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
                    var setting = ctx.CampaignRecycleSetting.FirstOrDefault(r => r.Id == settingId);
                    if (setting == null) return false;

                    ctx.CampaignRecycleSetting.Remove(setting);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        // CRUD para CampaignSchedule
        public bool AddCampaignSchedule(CampaignSchedule schedule)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    ctx.CampaignSchedule.Add(schedule);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch
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
                    var schedule = ctx.CampaignSchedule.FirstOrDefault(s => s.Id == scheduleId);
                    if (schedule == null) return false;

                    ctx.CampaignSchedule.Remove(schedule);
                    ctx.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        // CRUD para blacklistcampains
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
    }
}
