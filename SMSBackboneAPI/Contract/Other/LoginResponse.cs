using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract.Other
{
    public class LoginResponse
    {
        public UserInfo User { get; set; }
        public string Token { get; set; }
        public string Expiration { get; set; }
    }
}
