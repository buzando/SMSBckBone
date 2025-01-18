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
        public List<creditcards> GetCardsByUser(int userid)
        {
			try
			{
				using (var ctx = new Entities())
				{
					var creditscard = ctx.creditcards.Where(x => x.user_id == userid).ToList();
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
                    var creditscard = ctx.creditcards.Where(x => x.card_number == creditCard.card_number && x.user_id == creditCard.user_id).FirstOrDefault();
                    if (creditscard != null)
                    {
                        return "Existe";
                    }
                    else
                    {
                        var creditcarddb = new creditcards {created_at = DateTime.Now, user_id = creditCard.user_id, card_name = creditCard.card_name, card_number = creditCard.card_number, CVV = creditCard.CVV,
                        expiration_month = creditCard.expiration_month, expiration_year = creditCard.expiration_year, is_default = creditCard.is_default, Type = creditCard.Type};
                        creditcarddb.created_at = DateTime.Now;
                        ctx.creditcards.Add(creditcarddb);
                        ctx.SaveChanges();
                    }
                    return string.Empty;
                }
            }
            catch (Exception e)
            {
                return "Error";
            }

        }

        public bool DeleteCreditCard(int id)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var creditscard = ctx.creditcards.Where(x => x.Id == id).FirstOrDefault();
                    ctx.creditcards.Remove(creditscard);
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
