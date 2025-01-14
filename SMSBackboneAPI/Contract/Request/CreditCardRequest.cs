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

        public int UserId { get; set; }

        public string CardNumber { get; set; }

        public string CardName { get; set; }

        public byte ExpirationMonth { get; set; }

        public int ExpirationYear { get; set; }

        public string CVV { get; set; }

        public bool IsDefault { get; set; }


    }
}
