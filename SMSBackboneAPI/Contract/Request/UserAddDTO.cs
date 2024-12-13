using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Request
{
    public  class UserAddDTO
    {
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public DateTime BirthDate { get; set; } 
        public string Gender { get; set; } 
        public string Email { get; set; } 
        public string Password { get; set; } 
        public string PhoneNumber { get; set; } 
        public bool TwoFactorEnabled { get; set; }
        public string Conecctions { get; set; }
        public string Restrictions { get; set; }
        public int IdCliente { get; set; }
        public int IdUsuario { get; set; }

    }
}
