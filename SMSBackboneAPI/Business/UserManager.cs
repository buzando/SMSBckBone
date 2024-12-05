using AutoMapper;
using Contract.Response;
using Microsoft.Identity.Client;
using Modal;
using Modal.Model.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Contract.Request;
using System.Numerics;
namespace Business
{
    public class UserManager
    {
        public UserDto Login(string user, string password)
        {
            var userdto = new UserDto();
            /*Petición a base de datos*/
            using (var context = new Entities())
            {
                var userdb = context.Users.FirstOrDefault(p => p.email == user && p.passwordHash == password);

                var config = new MapperConfiguration(cfg =>

    cfg.CreateMap<Users, UserDto>()

); var mapper = new Mapper(config);

                userdto = mapper.Map<UserDto>(userdb);

            }

            //UserDto result = new UserDto
            //{
            //    userName = user,
            //    email = "user@correo.com",
            //    accessFailedCount = 0,
            //    lockoutEnabled = false,
            //    rol = 0,
            //    status = true
            //};
            return userdto;
        }

        public UserDto FindEmail(string email)
        {
            var userdto = new UserDto();
            /*Petición a base de datos*/
            using (var context = new Entities())
            {
                var userdb = context.Users.FirstOrDefault(p => p.email == email);

                var config = new MapperConfiguration(cfg =>

    cfg.CreateMap<Users, UserDto>()

); var mapper = new Mapper(config);

                userdto = mapper.Map<UserDto>(userdb);

            }

            //UserDto result = new UserDto
            //{
            //    userName = user,
            //    email = "user@correo.com",
            //    accessFailedCount = 0,
            //    lockoutEnabled = false,
            //    rol = 0,
            //    status = true
            //};
            return userdto;
        }

        public bool LockUser(UserDto user)
        {
            var userdto = new UserDto();
            /*Petición a base de datos*/
            using (var context = new Entities())
            {
                var userdb = context.Users.FirstOrDefault(p => p.Id == user.Id);

                userdb.lockoutEnabled = user.lockoutEnabled;
                userdb.lockoutEndDateUtc = user.lockoutEndDateUtc;
                context.SaveChanges();

            }

            return true;
        }
        public bool FindEmailToken(string email, string token)
        {
            using (var ctx = new Entities())
            {
                var user = ctx.Users.Where(x => x.email == email).FirstOrDefault();
                if (user == null)
                {
                    return false;
                }
                else
                {
                    var tokenexists = ctx.UserAccounRecovery.Where(x => x.iduser == user.Id && x.token == token && x.Expiration >= DateTime.Now).FirstOrDefault();
                    if (tokenexists == null)
                    {
                        return false;
                    }
                    else
                    {
                        user.emailConfirmed = true;
                        ctx.SaveChanges();
                    }

                }
                return true;
            }
        }
        public string GeneraToken(int iduser, int tipo)
        {
            var token = string.Empty;
            try
            {

                Guid miGuid = Guid.NewGuid();

                token = miGuid.ToString().Replace("-", string.Empty);

                using (var ctx = new Entities())
                {
                    var recovery = new UserAccounRecovery { Expiration = DateTime.Now.AddDays(1), iduser = iduser, token = token,type = tipo  };
                    ctx.UserAccounRecovery.Add(recovery);
                    ctx.SaveChanges();
                }

            }
            catch (Exception)
            {
                token = string.Empty;
            }
            return token;
        }

        public string EnvioCodigo(string dato, string tipo)
        {
            var token = string.Empty;
            if (tipo == "EMAIL")
            {
                Random random = new Random();
                int randomNumber = random.Next(100000, 1000000);

                token = randomNumber.ToString();

                var body = MailManager.GenerateMailMessage(dato, token, "", "Code");
                bool emailResponse = MailManager.SendEmail(dato, "Confirm your email", body);

            }
            if (tipo == "SMS")
            {
                token = "123456";
            }
            return token;
        }

        public bool SaveTwoFactor(string email)
        {
            var userdto = new UserDto();
            /*Petición a base de datos*/
            using (var context = new Entities())
            {
                var userdb = context.Users.FirstOrDefault(p => p.email == email);
                if (userdb != null)
                {

                    userdb.TwoFactorAuthentication = true;
                    context.SaveChanges();
                }
                else
                {
                    return false;
                }

            }

            //UserDto result = new UserDto
            //{
            //    userName = user,
            //    email = "user@correo.com",
            //    accessFailedCount = 0,
            //    lockoutEnabled = false,
            //    rol = 0,
            //    status = true
            //};
            return true;
        }

        public List<RoomsDTO> roomsByUser(string email)
        {
            var rooms = new List<RoomsDTO>();
            try
            {

                using (var ctx = new Entities())
                {
                    rooms =  ctx.Users
           .Join(ctx.Rooms,
              post => post.Id,
              meta => meta.iduser,
              (post, meta) => new { Post = post, Meta = meta })
           .Where(x => x.Post.email == email).Select(
                        x => new RoomsDTO {name = x.Meta.name, long_sms = x.Meta.long_sms, calls = x.Meta.calls, 
                            credits = x.Meta.credits, dscription = x.Meta.dscription, client = x.Meta.client, iduser = x.Meta.iduser, id = x.Meta.id }).ToList();
                }

                return rooms;
            }
            catch (Exception e)
            {
                return rooms;
            }
        }

        public bool NewPassword(PasswordResetDTO pass)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var user = ctx.Users.Where(x => x.email == pass.Email).FirstOrDefault();
                    if (user != null)
                    {
                        user.passwordHash = pass.NewPassword;
                        ctx.SaveChanges();
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public CreditDto GetCredit(string userName)
        {
            //Realizar petición a base de datos.
            return new CreditDto
            {
                Credit = 0
            };
        }
    }
}
