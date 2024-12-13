﻿using Business;
using Contract;
using Contract.Request;
using Contract.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Modal.Model.Model;
using Newtonsoft.Json;
using SMSBackboneAPI.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SMSBackboneAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        string JwtIssuer = "Issuer";
        string JwtAudience = "Audience";
        private IConfiguration configuration;
        public UserController(IConfiguration iConfig)
        {
            configuration = iConfig;
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Authenticate(LoginDto Login)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}
            var userManager = new Business.UserManager();
            var responseDto = userManager.Login(Login.email, Login.password);
            if (responseDto != null)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var byteKey = Encoding.UTF8.GetBytes(configuration.GetSection("SecretKey").Value);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("User", JsonConvert.SerializeObject(responseDto))
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    Issuer = JwtIssuer,
                    Audience = JwtAudience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(byteKey), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var respuesta = new ResponseDTO { user = responseDto, token = token.ToString(), expiration = DateTime.Now.AddDays(1) };
                // var response = Ok(tokenHandler.WriteToken(token));
                if (!responseDto.emailConfirmed)
                {


                    return BadRequest(new GeneralErrorResponseDto() { code = "UnconfirmedEmail", description = "Confirmation email could not be sent" });
                }
                if (!responseDto.status)
                {
                    return BadRequest(new GeneralErrorResponseDto() { code = "UserLocked", description = "User locked" });

                }
                var response = Ok(respuesta);

                return response;
            }
            else
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "BadCredentials", description = "Bad Credentials" });

            }
        }

        [HttpPost("LockUser")]
        public async Task<IActionResult> LockUser(lockDTO user)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}
            var userManager = new Business.UserManager();
            var responseDto = userManager.LockUser(user);
            if (responseDto)
            {

                var response = Ok();

                return response;
            }
            else
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "", description = "" });

            }
        }

        [AllowAnonymous]
        [HttpGet("GenerateconfirmationEmail")]
        public async Task<IActionResult> GenerateMail(string email, string type)//string email,[FromBody] string urlCallback)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();
            //if (_context.Users == null)
            //{
            //    return NoContent();
            //}

            //var user = await _userManager.FindByIdAsync(Convert.ToString(id));
            //var valid = _emailServices.ValidateEmail(email);
            //if (valid == null)
            //{
            //    return BadRequest(valid);
            //}

            var userManager = new Business.UserManager();

            var user = userManager.FindEmail(email);
            if (user == null)
            {
                errorResponse.code = "InvalidUser";
                errorResponse.description = "No matches found";
                return BadRequest(errorResponse);
            }

            var URL = Common.ConfigurationManagerJson("UrlSitioRecuperacion");
            var typeemail = 0;
            if (type == "confirmation")
            {
                typeemail = 1;
            }
            if (type == "GenerateMailMessage")
            {
                typeemail = 2;
            }
            var token = userManager.GeneraToken(user.Id, typeemail);
            //var confirmationLink = $"{urlCallback}?email={email}&token={token}"; 
            string body = MailManager.GenerateMailMessage(user.email, token, URL, "confirmation");
            bool emailResponse = MailManager.SendEmail(user.email, "Confirm your email", body);


            if (emailResponse)
            {
                return Ok(new { success = "success", message = "Confirmation email has been sent" });
            }
            else
            {
                errorResponse.code = "ConfirmationUnset";
                errorResponse.description = "Confirmation email could not be sent";
                return BadRequest(errorResponse);
            }
        }

        [AllowAnonymous]
        [HttpGet("confirmationEmail")]
        public IActionResult ConfirmMail(string email, string token)//string email,[FromBody] string urlCallback)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();

            var confirmation = userManager.FindEmailToken(email, token);
            var URL = Common.ConfigurationManagerJson("UrlSitio");
            if (!confirmation)
            {
                //Response.Redirect(URL);

            }
            else
            {
                //Response.Redirect(URL);

            }
            return Redirect(URL);
        }

        [AllowAnonymous]
        [HttpGet("SendConfirmation")]
        public IActionResult sendConfirmationMail(string dato, string tipo)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();
            var token = userManager.EnvioCodigo(dato, tipo);
            if (!string.IsNullOrEmpty(token))
            {
                var response = Ok(token);
                return response;
            }
            else
            {
                var response = BadRequest(errorResponse);
                return response;
            }

        }

        [AllowAnonymous]
        [HttpGet("SaveTwoFactor")]
        public IActionResult SaveTwoFactor(string email)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();
            var save = userManager.SaveTwoFactor(email);
            if (save)
            {
                var response = Ok();
                return response;
            }
            else
            {
                var response = BadRequest(errorResponse);
                return response;
            }

        }

        [AllowAnonymous]
        [HttpGet("GetRooms")]
        public IActionResult Roomsbyuser(string email)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();
            var listrooms = userManager.roomsByUser(email);
            if (listrooms.Count() > 0)
            {
                var response = Ok(listrooms);
                return response;
            }
            else
            {
                var response = BadRequest(errorResponse);
                return response;
            }

        }

        [AllowAnonymous]
        [HttpGet("GetUserByEmail")]
        public IActionResult GetUserByEmail(string email)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();
            var user = userManager.FindEmail(email);
            if (user != null)
            {
                var response = Ok(user);
                return response;
            }
            else
            {
                var response = BadRequest(errorResponse);
                return response;
            }

        }

        [HttpPost("NewPassword")]
        public async Task<IActionResult> NewPassword(PasswordResetDTO Login)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}
            var userManager = new Business.UserManager();
            var responseDto = userManager.NewPassword(Login);
            if (!responseDto)
            {


                return BadRequest(new GeneralErrorResponseDto() { code = "Error", description = "Password invalid" });



            }
            else
            {
                var response = Ok();
                return response;
            }
        }


        [HttpGet("Credit")]
        public async Task<IActionResult> Credit()
        {
            var autenticate = new AutenticationBearer(configuration).Validate(Request);
            if (autenticate == null)
            {
                return BadRequest("Token inválido.");
            }
            var userManager = new Business.UserManager();
            var result = userManager.GetCredit(autenticate.userName);
            return Ok(result);
        }


        [HttpPost("registerAccount")]
        public async Task<IActionResult> RegisterUser(RegisterUser user)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}

            var existe = new UserManager().FindEmail(user.email);
            if (existe != null)
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "DuplicateUserName", description = "DuplicateUserName" });

            }
            var clientManager = new Business.ClientManager();
            var responseDto = clientManager.ObtenerClienteporNombre(user.client);
            if (responseDto == null)
            {
                var newclient = new clientDTO { nombrecliente = user.client };
                var add = clientManager.AgregarCliente(newclient);
                if (add)
                {
                    var usuario = new UserManager().AddUserFromRegister(user);
                    if (usuario != null)
                    {
                        var room = new roomsManager().addroomByNewUser(usuario.Id, usuario.IdCliente);
                        if (room)
                        {
                            //var enviomail = new  UserManager().EnvioCodigo(user.email, "EMAIL");
                            //if (string.IsNullOrEmpty(enviomail))
                            //{
                            //    return BadRequest(new GeneralErrorResponseDto() { code = "ConfirmationUnsent", description = "ConfirmationUnsent" });

                            //}
                            var tokenHandler = new JwtSecurityTokenHandler();
                            var byteKey = Encoding.UTF8.GetBytes(configuration.GetSection("SecretKey").Value);

                            var tokenDescriptor = new SecurityTokenDescriptor
                            {
                                Subject = new ClaimsIdentity(new Claim[]
                                {
                        new Claim("User", JsonConvert.SerializeObject(responseDto))
                                }),
                                Expires = DateTime.UtcNow.AddDays(1),
                                Issuer = JwtIssuer,
                                Audience = JwtAudience,
                                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(byteKey), SecurityAlgorithms.HmacSha256Signature)
                            };
                            var token = tokenHandler.CreateToken(tokenDescriptor);
                            var respuesta = new ResponseDTO { user = usuario, token = token.ToString(), expiration = DateTime.Now.AddDays(1) };
                            return Ok(respuesta);
                        }
                        else
                        {
                            return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                        }
                    }
                    else
                    {
                        return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                    }
                }
                else
                {
                    return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                }
            }
            else
            {
                var usuario = new UserManager().AddUserFromRegister(user);
                if (usuario != null)
                {
                    var room = new roomsManager().addroomByNewUser(usuario.Id, usuario.IdCliente);
                    if (room)
                    {
                        //var token = new UserManager().EnvioCodigo(user.email, "EMAIL");
                        //if (string.IsNullOrEmpty(token))
                        //{
                        //    return BadRequest(new GeneralErrorResponseDto() { code = "ConfirmationUnsent", description = "ConfirmationUnsent" });

                        //}
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var byteKey = Encoding.UTF8.GetBytes(configuration.GetSection("SecretKey").Value);

                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new Claim[]
                            {
                        new Claim("User", JsonConvert.SerializeObject(responseDto))
                            }),
                            Expires = DateTime.UtcNow.AddDays(1),
                            Issuer = JwtIssuer,
                            Audience = JwtAudience,
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(byteKey), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var token = tokenHandler.CreateToken(tokenDescriptor);
                        var respuesta = new ResponseDTO { user = usuario, token = token.ToString(), expiration = DateTime.Now.AddDays(1) };
                        return Ok(respuesta);
                        return Ok(usuario);
                    }
                    else
                    {
                        return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                    }
                }
                else
                {
                    return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                }

            }
        }

        [AllowAnonymous]
        [HttpGet("GetUsersByClient")]
        public IActionResult GetUsersByClient(int Client)
        {
            GeneralErrorResponseDto errorResponse = new GeneralErrorResponseDto();


            var userManager = new Business.UserManager();
            var users = userManager.FindUsers(Client);
            if (users.Count() > 0)
            {
                var response = Ok(users);
                return response;
            }
            else
            {
                var response = BadRequest(errorResponse);
                return response;
            }

        }


        [HttpGet("DeleteUserByid")]
        public async Task<IActionResult> DeleteUserByid(int id)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}
            var UserManager = new Business.UserManager();
            var responseDto = UserManager.DeleteUser(id);
            if (!responseDto)
            {


                return BadRequest(new GeneralErrorResponseDto() { code = "Error", description = "Creating ROOM" });



            }
            else
            {
                var response = Ok();
                return response;
            }
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser(UserAddDTO user)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}

            var existe = new UserManager().FindEmail(user.Email);
            if (existe != null)
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "DuplicateUserName", description = "DuplicateUserName" });

            }

            var usuario = new UserManager().AddUserFromManage(user);
            if (usuario != 0)
            {

                var room = new roomsManager().ManageroomBystring(user.Conecctions, usuario);

                if (room)
                {
                    //var enviomail = new UserManager().EnvioCodigo(user.Email, "EMAIL");
                    //if (string.IsNullOrEmpty(enviomail))
                    //{
                    //    return BadRequest(new GeneralErrorResponseDto() { code = "ConfirmationUnsent", description = "ConfirmationUnsent" });

                    //}

                    return Ok();
                }
                else
                {
                    return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                }
            }
            else
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

            }


        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserAddDTO user)
        {
            GeneralErrorResponseDto[] errorResponse = new GeneralErrorResponseDto[1];
            //var login = await ServiceRequest.GetRequest<LoginDto>(Request.Body);
            //if (login == null)
            //{
            //    return BadRequest("Sin request valido.");
            //}

            var usuario = new UserManager().UpdateUser(user);
            if (usuario)
            {

                var room = new roomsManager().ManageroomBystring(user.Conecctions, user.IdUsuario);

                if (room)
                {
                    //var enviomail = new UserManager().EnvioCodigo(user.Email, "EMAIL");
                    //if (string.IsNullOrEmpty(enviomail))
                    //{
                    //    return BadRequest(new GeneralErrorResponseDto() { code = "ConfirmationUnsent", description = "ConfirmationUnsent" });

                    //}

                    return Ok();
                }
                else
                {
                    return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

                }
            }
            else
            {
                return BadRequest(new GeneralErrorResponseDto() { code = "agregarusuario", description = "Error al guardar usuario intente más tarde" });

            }


        }

    }
}
