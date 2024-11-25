﻿using Contract.Request;
using Contract.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Modal.Model.Model;
using Newtonsoft.Json;
using SMSBackboneAPI.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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

                    return BadRequest(new GeneralErrorResponseDto() { code = "ConfirmationUnsent", description = "Confirmation email could not be sent" });
                }
                var response = Ok(respuesta);

                return response;
            }
            else
            {
                return BadRequest("Usuario inválido.");
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

    }
}
