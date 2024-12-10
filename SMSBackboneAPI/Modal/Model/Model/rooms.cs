using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal.Model.Model
{
    public class rooms
    {
        [Key]
        public int Id { get; set; } 

        public string Name { get; set; } 

        public int Calls { get; set; } = 0; 

        public int Credits { get; set; } = 0; 

        public string Description { get; set; } 

        [Required]
        [ForeignKey("User")]
        public int IdUser { get; set; } 

        //public virtual Users User { get; set; } 

        public int long_sms { get; set; } = 0; 

        [Required]
        [ForeignKey("Client")]
        public int IdClient { get; set; } 

        //public virtual clients Client { get; set; } 
    }
}
