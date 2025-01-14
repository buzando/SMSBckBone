using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model.Model
{
    public class creditcards
    {
        [Key]
        public int Id { get; set; } 

        public int UserId { get; set; }

        public string CardNumber { get; set; } 

        public string CardName { get; set; } 

        public byte ExpirationMonth { get; set; } 

        public int ExpirationYear { get; set; } 

        public string CVV { get; set; }

        public bool IsDefault { get; set; } 

        public DateTime CreatedAt { get; set; } 

        public DateTime? UpdatedAt { get; set; } 
        [ForeignKey("UserId")]
        public virtual Users User { get; set; }
    }
}
