using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Request
{
    public class roomsDTO
    {
        public int id { get; set; }
        public int iduser { get; set; }
        public string name { get; set; }
        public string client { get; set; }
        public string dscription { get; set; }
        public decimal credits { get; set; }
        public Int64 long_sms { get; set; }
        public Int64 calls { get; set; }
    }
}
