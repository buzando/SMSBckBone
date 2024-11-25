using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Response
{
    public class UserDto
    {
        public int Id { get; set; }
        public string idUser { get; set; }
        public string userName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public bool status { get; set; }
        public DateTime createDate { get; set; }
        public DateTime lastPasswordChangeDate { get; set; }
        public string email { get; set; }
        public bool emailConfirmed { get; set; }
        public string passwordHash { get; set; }
        public string securityStamp { get; set; }
        public DateTime lockoutEndDateUtc { get; set; }
        public bool lockoutEnabled { get; set; }
        public int accessFailedCount { get; set; }
        public int idRole { get; set; }
        public int idFeedback { get; set; }
        public DateTime feedbackDate { get; set; }
        public bool clauseAccepted { get; set; }
        public DateTime clauseDate { get; set; }
    }
}
