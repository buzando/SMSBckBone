using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Request
{
    public class CreditCardRequest
    {
        public int Id { get; set; }

        public int user_id { get; set; }

        public string card_number { get; set; }

        public string card_name { get; set; }

        public byte expiration_month { get; set; }

        public short expiration_year { get; set; }

        public string CVV { get; set; }

        public bool is_default { get; set; }

        public string Type { get; set; }
    }
}
