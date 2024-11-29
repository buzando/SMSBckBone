using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model.Model
{
    public class rooms
    {
        [Key]
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
