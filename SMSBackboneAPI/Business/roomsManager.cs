using Contract.Response;
using Modal;
using Modal.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class roomsManager
    {
        public bool addroomByNewUser(int User, int client)
        {
			try
			{
				using (var ctx = new Entities())
				{
					var room = new Modal.Model.Model.rooms { Name = "Default", Calls = 0, Credits = 0, Description = "Room default", IdUser = User, long_sms = 0, IdClient = client };
					ctx.Rooms.Add(room);
					ctx.SaveChanges();
				
				}
				return true;
			}
			catch (Exception e)
			{
				return false;
			}
        }
    }
}
