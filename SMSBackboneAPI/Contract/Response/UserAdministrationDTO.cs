using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Response
{
    public class UserAdministrationDTO
    {
        public int id { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public string Conecctions { get; set; }
        public string Restricctions { get; set; }
        public bool status { get; set; }
    }
}
