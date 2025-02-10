using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Request
{
    public class BillingInformationDto
    {
        public string Email { get; set; } // Relación con la tabla de usuarios
        public string BusinessName { get; set; } // Nombre o razón social
        public string TaxId { get; set; } // RFC
        public string TaxRegime { get; set; } // Régimen fiscal
        public string Cfdi { get; set; } // CFDI
        public string PostalCode { get; set; } // Código postal

    }
}
