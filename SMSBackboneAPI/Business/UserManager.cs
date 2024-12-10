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
using System.Runtime.CompilerServices;
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
            try
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
            catch (Exception e)
            {
                return null;
            }
        }

        public bool LockUser(lockDTO user)
        {
            var userdto = new UserDto();
            user.lockoutEndDateUtc = DateTime.Now.AddMinutes(30);
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
                    var recovery = new UserAccounRecovery { Expiration = DateTime.Now.AddDays(1), iduser = iduser, token = token, type = tipo };
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
            try
            {

                if (tipo == "EMAIL")
                {
                    Random random = new Random();
                    int randomNumber = random.Next(100000, 1000000);

                    token = randomNumber.ToString();

                    var body = MailManager.GenerateMailMessage(dato, token, "", "confirmation");
                    bool emailResponse = MailManager.SendEmail(dato, "Confirm your email", body);

                }
                if (tipo == "SMS")
                {
                    token = "123456";
                }
            }
            catch (Exception e)
            {
                token = string.Empty;
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
                    rooms = ctx.Users
           .Join(ctx.Rooms,
              post => post.Id,
              meta => meta.IdUser,
              (post, meta) => new { Post = post, Meta = meta })
           .Where(x => x.Post.email == email).Select(
                        x => new RoomsDTO
                        {
                            name = x.Meta.Name,
                            long_sms = x.Meta.long_sms,
                            calls = x.Meta.Calls,
                            credits = x.Meta.Credits,
                            dscription = x.Meta.Description,
                            //client = x.Meta.Client,
                            iduser = x.Meta.IdUser,
                            id = x.Meta.Id
                        }).ToList();
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
                        user.TwoFactorAuthentication = pass.TwoFactorAuthentication;
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

        public bool NewPassword(string user, string password)
        {
            try
            {

                using (var ctx = new Entities())
                {
                    var usuario = ctx.Users.Where(x => x.email == user).FirstOrDefault();
                    usuario.passwordHash = password;
                    usuario.lastPasswordChangeDate = DateTime.Now;
                    ctx.SaveChanges();
                }
                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public UserDto AddUserFromRegister(RegisterUser register)
        {
            try
            {
                var user = new Users
                {
                    accessFailedCount = 0,
                    Call = register.llamada,
                    clauseAccepted = false,
                    createDate = DateTime.Now,
                    email = register.email,
                    emailConfirmed = false,
                    firstName = register.firstName,
                    idRole = 2,
                    lastName = register.lastName,
                    lastPasswordChangeDate = DateTime.Now,
                    lockoutEnabled = false,
                    passwordHash = "123456",
                    phonenumber = register.phone,
                    SMS = register.sms,
                    userName = register.email,
                    lockoutEndDateUtc = null,
                    TwoFactorAuthentication = false,
                    status = true
                };
                var cliente = new ClientManager().ObtenerClienteporNombre(register.client);
                if (cliente != null)
                {
                    user.IdCliente = cliente.id;
                    using (var ctx = new Entities())
                    {
                        ctx.Users.Add(user);
                        ctx.SaveChanges();
                    }
                    var config = new MapperConfiguration(cfg =>

    cfg.CreateMap<Users, UserDto>()

); var mapper = new Mapper(config);

                    var userdto = mapper.Map<UserDto>(user);
                    return userdto;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
