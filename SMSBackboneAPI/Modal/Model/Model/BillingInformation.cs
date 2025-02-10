using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model.Model
{
    public class BillingInformation
    {
        public int Id { get; set; }
        public int userId { get; set; } // Relación con la tabla de usuarios
        public string BusinessName { get; set; } // Nombre o razón social
        public string TaxId { get; set; } // RFC
        public string TaxRegime { get; set; } // Régimen fiscal
        public string Cfdi { get; set; } // CFDI
        public string PostalCode { get; set; } // Código postal
        public DateTime CreatedAt { get; set; } // Fecha de creación
        public DateTime? UpdatedAt { get; set; } // Fecha de última actualización

        public virtual Users User { get; set; }
    }
}
