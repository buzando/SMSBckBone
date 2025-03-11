﻿using AutoMapper;
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
using Microsoft.EntityFrameworkCore;
using Modal.Model;
using log4net;
namespace Business
{
    public class UserManager
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(UserManager));

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
                userdto.rol = context.Roles.Where(x => x.id == userdb.idRole).Select(x => x.Role).FirstOrDefault();

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
            var client = string.Empty;
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
                    userdto.Client = context.clients.Where(x => x.id == userdb.IdCliente).Select(x => x.nombrecliente).FirstOrDefault();
                    userdto.rol = context.Roles.Where(x => x.id == userdb.idRole).Select(x => x.Role).FirstOrDefault();

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
                log.Error(e.Message);
                return null;
            }
        }

        public List<UserAdministrationDTO> FindUsers(int Client)
        {
            var userDtoList = new List<UserAdministrationDTO>();
            try
            {

                using (var ctx = new Entities())
                {
                    userDtoList = ctx.roomsbyuser
    .Join(ctx.Users,
          rb => rb.idUser, // Clave foránea en roomsbyuser
          u => u.Id,       // Clave primaria en users
          (rb, u) => new { rb, u }) // Combina roomsbyuser y users
    .Join(ctx.clients,
          combined => combined.u.IdCliente, // Clave foránea en users
          c => c.id,                        // Clave primaria en clients
          (combined, c) => new { combined.rb, combined.u, c }) // Combina users con clients
    .Join(ctx.Roles,
          combined => combined.u.idRole,   // Clave foránea en users
          r => r.id,                       // Clave primaria en Roles
          (combined, r) => new { combined.rb, combined.u, combined.c, r }) // Combina con Roles
    .Where(x => x.c.id == Client) // Filtra por id del cliente aquí
    .GroupBy(x => new
    {
        x.u.Id,
        x.u.firstName,
        x.u.email,
        x.u.status,
        x.u.idRole,
        x.r.Role,
        x.u.phonenumber,
        x.c.nombrecliente
    })
    .Select(group => new UserAdministrationDTO
    {
        id = group.Key.Id,
        name = group.Key.firstName,
        email = group.Key.email,
        idRole = group.Key.idRole,
        Role = group.Key.Role,
        Rooms = string.Join(", ", group.Select(g => g.rb.Rooms.name)),
        PhoneNumber = group.Key.phonenumber,
        Client = group.Key.nombrecliente
    })
    .ToList();
                }

                userDtoList = userDtoList.Where(x => x.Role != "Root" && x.Role != "Telco").ToList();

                return userDtoList;
            }
            catch (Exception e)
            {
                return userDtoList;
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

        public string EnvioCodigo(string dato, string tipo, string type)
        {

            var token = string.Empty;
            try
            {

                if (tipo == "EMAIL")
                {
                    Random random = new Random();
                    int randomNumber = random.Next(100000, 1000000);

                    token = randomNumber.ToString();

                    var body = MailManager.GenerateMailMessage(dato, token, "", type);
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
                    rooms = ctx.roomsbyuser
    .Join(ctx.Users,
          rb => rb.idUser, // Clave foránea en roomsbyuser
          u => u.Id,       // Clave primaria en users
          (rb, u) => new { rb, u }) // Combina roomsbyuser y users
    .Where(combined => combined.u.email == email) // Filtra por el email aquí
    .Join(ctx.clients,
          combined => combined.u.IdCliente, // Clave foránea en users
          c => c.id,                        // Clave primaria en clients
          (combined, c) => new RoomsDTO
          {
              id = combined.rb.Rooms.id,                   // ID de roomsbyuser
              iduser = combined.u.Id,               // ID del usuario
              name = combined.rb.Rooms.name,        // Nombre de la sala
              description = combined.rb.Rooms.description, // Descripción de la sala
              credits = combined.rb.Rooms.credits,  // Créditos de la sala
              long_sms = combined.rb.Rooms.long_sms,// SMS largos
              calls = combined.rb.Rooms.calls,      // Llamadas
              idClient = combined.u.IdCliente,      // ID del cliente
              Cliente = c.nombrecliente,             // Nombre del cliente
              short_sms = combined.rb.Rooms.short_sms
          })
    .ToList();
                    rooms = rooms
    .GroupBy(x => x.name) // Agrupa por nombre
    .Select(g => g.First()) // Toma el primer elemento de cada grupo
    .ToList();
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
                    lastName = register.lastName,
                    lastPasswordChangeDate = DateTime.Now,
                    lockoutEnabled = false,
                    passwordHash = register.Password,
                    phonenumber = register.phone,
                    SMS = register.sms,
                    userName = register.email,
                    lockoutEndDateUtc = null,
                    TwoFactorAuthentication = false,
                    status = true,
                    SecondaryEmail = register.emailConfirmation,
                    futurerooms = false
                };
                var cliente = new ClientManager().ObtenerClienteporNombre(register.client);
                if (cliente != null)
                {
                    
                    user.IdCliente = cliente.id;
                    using (var ctx = new Entities())
                    {
                        var idrole = ctx.Roles.Where(x => x.Role.ToLower() == "administrador").Select(x => x.id).FirstOrDefault();
                        user.idRole = idrole;
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
                log.Error(e.Message);
                return null;
            }
        }

        public int AddUserFromManage(UserAddDTO register)
        {
            try
            {
                var user = new Users
                {
                    accessFailedCount = 0,
                    Call = false,
                    clauseAccepted = false,
                    createDate = DateTime.Now,
                    email = register.Email,
                    emailConfirmed = false,
                    firstName = register.FirstName,
                    lastName = "",
                    lastPasswordChangeDate = DateTime.Now,
                    lockoutEnabled = false,
                    passwordHash = register.Password,
                    phonenumber = register.PhoneNumber,
                    SMS = false,
                    userName = register.Email,
                    lockoutEndDateUtc = null,
                    TwoFactorAuthentication = false,
                    status = true,
                    IdCliente = register.IdCliente,
                    futurerooms = register.FutureRooms,
                    SecondaryEmail = register.ConfirmationEmail
                };



                using (var ctx = new Entities())
                {
                    user.idRole = ctx.Roles.Where(x => x.Role == register.Profile.ToLower()).Select(x => x.id).FirstOrDefault();
                    ctx.Users.Add(user);
                    ctx.SaveChanges();
                }

                return user.Id;

            }
            catch (Exception e)
            {
                return 0;
            }
        }

        public bool UpdateUser(UserAddDTO register)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var usuarer = ctx.Users.Where(u => u.Id == register.IdUsuario).FirstOrDefault();
                    usuarer.firstName = register.FirstName;
                    usuarer.phonenumber = register.PhoneNumber;
                    usuarer.idRole = ctx.Roles.Where(x => x.Role == register.Profile.ToLower()).Select(x => x.id).FirstOrDefault();


                    ctx.SaveChanges();
                }

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool UpdateUserRegistration(UserFinishRegistrationDTO register)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var usuarer = ctx.Users.Where(u => u.email == register.Email).FirstOrDefault();
                    usuarer.firstName = register.FirstName;
                    usuarer.phonenumber = register.Phonenumber;
                    usuarer.lastName = register.LastName;
                    usuarer.emailConfirmed = true;

                    ctx.SaveChanges();
                }

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }
        public bool UpdateLogUser(UpdateUser update)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var usuarer = ctx.Users.Where(u => u.email == update.Email).FirstOrDefault();
                    usuarer.firstName = update.FirstName;
                    usuarer.phonenumber = update.PhoneNumber;
                    if (!string.IsNullOrEmpty(update.Password))
                    {

                        usuarer.passwordHash = update.Password;
                    }
                    usuarer.lastName = update.LastName;
                    usuarer.lastPasswordChangeDate = DateTime.Now;

                    ctx.SaveChanges();
                }

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool DeleteUser(int id)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var roomforeign = ctx.roomsbyuser.Where(x => x.idUser == id).ToList();
                    ctx.roomsbyuser.RemoveRange(roomforeign);
                    ctx.SaveChanges();

                    var tokens = ctx.UserAccounRecovery.Where(x => x.iduser == id).ToList();
                    ctx.UserAccounRecovery.RemoveRange(tokens);
                    ctx.SaveChanges();

                    var users = ctx.Users.Where(x => x.Id == id).FirstOrDefault();
                    ctx.Users.Remove(users);
                    ctx.SaveChanges();

                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        #region billing

        public bool AddBillingInformation(BillingInformationDto billing)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var iduser = ctx.Users.Where(x => x.email == billing.Email).FirstOrDefault();
                    var exist = ctx.BillingInformation.Where(x => x.User.email == billing.Email).FirstOrDefault();
                    if (exist == null)
                    {

                        var newbilling = new BillingInformation
                        {
                            userId = iduser.Id,
                            BusinessName = billing.BusinessName,
                            Cfdi = billing.Cfdi,
                            PostalCode = billing.Cfdi,
                            TaxId = billing.TaxId,
                            TaxRegime = billing.TaxRegime,
                            CreatedAt = DateTime.Now
                        };
                        ctx.BillingInformation.Add(newbilling);
                    }
                    else
                    {
                        exist.TaxRegime = billing.TaxRegime;
                        exist.TaxId = billing.TaxId;
                        exist.BusinessName = billing.BusinessName;
                        exist.Cfdi = billing.Cfdi;
                        exist.PostalCode = billing.PostalCode;
                        exist.UpdatedAt = DateTime.Now;
                    }

                    ctx.SaveChanges();
                    return true;
                }
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool UpdateBillingInformation(BillingInformationDto billing)
        {
            try
            {
                using (var ctx = new Entities())
                {
                    var BillingInformation = ctx.BillingInformation.Where(u => u.User.email == billing.Email).FirstOrDefault();
                    BillingInformation.TaxRegime = billing.TaxRegime;
                    BillingInformation.TaxId = billing.TaxId;
                    BillingInformation.BusinessName = billing.BusinessName;
                    BillingInformation.Cfdi = billing.Cfdi;
                    BillingInformation.PostalCode = billing.PostalCode;
                    BillingInformation.UpdatedAt = DateTime.Now;
                    ctx.SaveChanges();
                }

                return true;

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public BillingInformationDto GetBillingInformation(string Email)
        {
            var billing = new BillingInformationDto();
            try
            {
                using (var ctx = new Entities())
                {
                    billing = ctx.BillingInformation.Select(x => new BillingInformationDto
                    {
                        Email = x.User.email,
                        BusinessName = x.BusinessName,
                        Cfdi = x.Cfdi,
                        PostalCode = x.PostalCode,
                        TaxId = x.TaxId,
                        TaxRegime = x.TaxRegime
                    }).FirstOrDefault();
                }
                return billing;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        #endregion

        #region recharge
        public bool RechargeUser(CreditRechargeRequest credit)
        {
            try
            {
                var creditrecharge = new CreditRecharge
                {
                    Chanel = credit.Chanel,
                    idCreditCard = credit.IdCreditCard,
                    quantityCredits = credit.QuantityCredits,
                    quantityMoney = credit.QuantityMoney,
                    RechargeDate = DateTime.Now,
                    idUser = credit.IdUser, 
                    AutomaticInvoice = credit.AutomaticInvoice
                };
                //aqui va el openpay

                creditrecharge.Estatus = "Esperando";
                using (var ctx = new Entities())
                {
                    ctx.CreditRecharge.Add(creditrecharge);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public List<CreditHystoric> GetHistoricByUser(Datepickers credit)
        {
            var historic = new List<CreditHystoric>();
            try
            {
               
                using (var ctx = new Entities())
                {
                    historic = (from cr in ctx.CreditRecharge
                                join u in ctx.Users on cr.idUser equals u.Id
                                join c in ctx.clients on u.IdCliente equals c.id
                                join cc in ctx.creditcards on cr.idCreditCard equals cc.Id
                                where cr.RechargeDate >= credit.FechaInicio && cr.RechargeDate <= credit.FechaFin && credit.IdUser == credit.IdUser // 🔥 Filtro agregado
                                select new CreditHystoric
                                {
                                    id = cr.Id,
                                    Client = c.nombrecliente,
                                    quantityMoney = cr.quantityMoney,
                                    RechargeDate = cr.RechargeDate,
                                    Estatus = cr.Estatus,
                                    PaymentMethod = $"{cc.Type} •••• {cc.card_number.Substring(cc.card_number.Length - 4)} - {cc.card_name}"
                                }).ToList();

                }
                return historic;
            }
            catch (Exception e)
            {
                return new List<CreditHystoric>();
            }
        }

        public bool SaveRechargeSettings(AmountNotificationRequest Amount)
        {
            var recharge = new AmountNotification();
            try
            {
                recharge.AmountValue = Amount.AmountValue;
                recharge.short_sms = Amount.ShortSms;
                recharge.long_sms = Amount.LongSms;
                recharge.call = Amount.Call;
                recharge.AutoRecharge = Amount.AutoRecharge;
                recharge.AutoRechargeAmountNotification = Amount.AutoRechargeAmountNotification;
                recharge.AutoRechargeAmount = Amount.AutoRechargeAmount;
                using (var ctx = new Entities())
                {
                    ctx.AmountNotification.Add(recharge);
                    ctx.SaveChanges();
                    foreach (var item in Amount.Users)
                    {
                        var byuser = new AmountNotificationUser();
                        byuser.NotificationId = recharge.id;
                        byuser.UserId = ctx.Users.Where(x => x.email == item).Select(x => x.Id).FirstOrDefault();
                        ctx.AmountNotificationUser.Add(byuser);
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        #endregion
    }
}
