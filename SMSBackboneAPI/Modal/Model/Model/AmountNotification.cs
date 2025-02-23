using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model.Model
{
    public class AmountNotification
    {
        [Key]
        public int Id { get; set; }

        public bool? ShortSms { get; set; }
        public bool? LongSms { get; set; }
        public bool? Call { get; set; }

        [Column("AmountNotification", TypeName = "decimal(10,2)")] // 🔥 Se mantiene el nombre
        public decimal AmountValue { get; set; }

        public bool? AutoRecharge { get; set; }

        public decimal? AutoRechargeAmountNotification { get; set; }
        public decimal? AutoRechargeAmount { get; set; }

        // Relación con CreditCards
        public int? IdCreditCard { get; set; }
        public virtual creditcards CreditCard { get; set; }
    }
}
