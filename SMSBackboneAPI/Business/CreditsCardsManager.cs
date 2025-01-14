using AutoMapper;
using Contract.Request;
using Contract.Response;
using Modal;
using Modal.Model.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class CreditsCardsManager
    {
        public List<creditcards> GetCardsByUser(string email)
        {
			try
			{
				using (var ctx = new Entities())
				{
					var creditscard = ctx.creditcards.Where(x => x.User.email == email).ToList();
					return creditscard;
				}
			}
			catch (Exception e)
			{
				return null;
			}

        }

        public string AddCreditCard(CreditCardRequest creditCard)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var creditscard = ctx.creditcards.Where(x => x.CardNumber == creditCard.CardNumber && x.User.Id == creditCard.UserId).ToList();
                    if (creditCard != null)
                    {
                        return "Existe";
                    }
                    else
                    {
                        var config = new MapperConfiguration(cfg =>

 cfg.CreateMap<creditcards, CreditCardRequest>()
                        ); var mapper = new Mapper(config);

                        var creditcarddb = mapper.Map<creditcards>(creditCard);
                        ctx.creditcards.Add(creditcarddb);
                    }
                    return string.Empty;
                }
            }
            catch (Exception e)
            {
                return "Error";
            }

        }
    }
}
