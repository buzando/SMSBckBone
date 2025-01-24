using Contract.Response;
using Modal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class MyNumbersManager
    {
        public List<MyNumbersResponse> NumbersByUser(string email)
        {
			var numbres = new List<MyNumbersResponse>();

            try
			{
				using (var ctx = new Entities())
				{
					numbres = ctx.MyNumbers.Where(x => x.User.email == email).Select(x => new MyNumbersResponse {Cost = x.Cost, Id = x.Id, IdUser = x.IdUser, Lada = x.Lada
					, Municipality = x.Municipality, NextPaymentDate = x.NextPaymentDate, Number = x.Number, Service = x.Service, State = x.State, Type = x.Type}).ToList();
				}
				return numbres;

            }
			catch (Exception e)
			{
				return new List<MyNumbersResponse>();
			}
        }
    }
}
