using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Business
{
    public class MailManager
    {
        public static bool SendEmail(string userEmail, string subject, string body)
        {
            //_logger.LogInformation("Sending email confirmation");
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("smsconnectnotifications@nuxiba.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = subject;//"Confirm your email";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = body;

            //mailMessage.AlternateViews.Add();

            SmtpClient client = new SmtpClient();
            client.UseDefaultCredentials = false;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential("smsconnectnotifications@nuxiba.com", "kifqy5-samroh-pavByv");
            client.Host = "smtp.ionos.com";//"smtpout.secureserver.net";
            client.Port = 587;//80;

            try
            {
                client.Send(mailMessage);
               // _logger.LogInformation("Confirmation email sent successfully");
                return true;
            }
            catch (Exception ex)
            {
                //_logger.LogError("Error when triying to send email confirmation.", ex); //An error occurred while trying to send the confirmation email
                return false;
            }

        }

        public static string GenerateMailMessage(string email, string token, string url, string msgType)
        {
            string msgBody = "";
            var link = $"{url}?email={email}&token={token}";

            switch (msgType)
            {
                case "confirmation":
                    msgBody = $"<h1>Confirm Email</h1>" + $"Please click on the following link to confirm your email and complete the registration:<p>" +
                        $"<a href=\"{link}\">Confirm</a></p>";
                    break;
                case "recovery":
                    msgBody = $"<h1>Recorver Password</h1>" + $"Please click on the following link to change your password:<p>" +
                        $"<a href=\"{link}\">Recover Password</a></p>";
                    break;
                default:
                    msgBody = "";
                    break;
            }

            return msgBody;
        }
    }
}
