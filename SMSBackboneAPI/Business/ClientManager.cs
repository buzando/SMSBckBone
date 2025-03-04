using Modal;
using Modal.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contract.Response;
using AutoMapper;
using Modal.Model.Model;
using log4net;
namespace Business
{
    public class ClientManager
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(UserManager));

        public bool AgregarCliente(clientDTO cliente)
        {

            try
            {
                var config = new MapperConfiguration(cfg =>

  cfg.CreateMap<clientDTO, clients>()
                ); var mapper = new Mapper(config);

               var clientmodel = mapper.Map<clients>(cliente);


                using (var ctx = new Entities())
                {
                    ctx.clients.Add(clientmodel);
                    ctx.SaveChanges();
                }
                return true;
            }
            catch (Exception e)
            {
                log.Error(e.Message);
                return false;
            }
        }

        public clientDTO ObtenerClienteporNombre(string cliente)
        {
            try
            {
                var clientereturn = new clientDTO();
                using (var ctx = new Entities())
                {
                    var clientdto = ctx.clients.Where(x => x.nombrecliente.ToLower() == cliente.ToLower()).FirstOrDefault();

                    var config = new MapperConfiguration(cfg =>

        cfg.CreateMap<clients, clientDTO>()

    ); var mapper = new Mapper(config);

                    clientereturn = mapper.Map<clientDTO>(clientdto);
                }
                return clientereturn;
            }
            catch (Exception e)
            {
                log.Error(e.Message);
                return null;
            }
        }

        public clientDTO ObtenerClienteporID(int id)
        {
            try
            {
                var clientereturn = new clientDTO();
                using (var ctx = new Entities())
                {
                    var clientdto = ctx.clients.Where(x => x.id == id).FirstOrDefault();

                    var config = new MapperConfiguration(cfg =>

        cfg.CreateMap<clients, clientDTO>()

    ); var mapper = new Mapper(config);

                    clientereturn = mapper.Map<clientDTO>(clientdto);
                }
                return clientereturn;
            }
            catch (Exception e)
            {
                log.Error(e.Message);
                return null;
            }
        }

    }
}
