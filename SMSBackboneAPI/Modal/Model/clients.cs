using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model
{
    public class clients
    {
        [Key]
        public int id { get; set; }
        public string nombrecliente { get; set; }
    }
}
