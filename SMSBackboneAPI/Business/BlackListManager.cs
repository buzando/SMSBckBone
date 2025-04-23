using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Contract.Response;
using Modal;
using Modal.Model.Model;
using ClosedXML.Excel;
using Contract.Request;

namespace Business
{
    public class BlackListManager
    {
        public List<BlackListResponse> GetRecordsByUser(int id)
        {
            var lista = new List<BlackListResponse>();
            try
            {
                using (var ctx = new Entities())
                {
                    lista = ctx.BlackList
     .Where(x => x.IdUser == id)
     .GroupBy(x => x.Name)
     .Select(g => new BlackListResponse
     {
         id = g.First().Id,
         CreationDate = g.First().CreationDate,
         ExpirationDate = g.First().ExpirationDate,
         Name = g.Key,
         Quantity = g.Count()
     })
     .ToList();

                }
            }
            catch (Exception e)
            {
                return lista;
            }
            return lista;
        }

        public bool ProcessExcelBase64(BlackListRequest blacklistfile)
        {
            try
            {

                var archivoBytes = Convert.FromBase64String(blacklistfile.FileBase64);
                var telefonos = new List<string>();

                using (var stream = new MemoryStream(archivoBytes))
                using (var workbook = new XLWorkbook(stream))
                {
                    var hoja = workbook.Worksheet(1);
                    int fila = 1;

                    while (true)
                    {
                        var celda = hoja.Cell($"A{fila}").GetString()?.Trim();
                        if (string.IsNullOrEmpty(celda))
                            break;

                        telefonos.Add(celda);
                        fila++;
                    }
                }

                using (var ctx = new Entities())
                {

                    var entidades = telefonos
                        .Distinct()
                        .Select(t => new BlackList
                        {
                            Name = blacklistfile.Name,
                            phone = t,
                            ExpirationDate = blacklistfile.ExpirationDate,
                            IdUser = blacklistfile.IdUser,
                            CreationDate = DateTime.Now
                        }).ToList();

                    ctx.BlackList.AddRange(entidades);
                    ctx.SaveChanges();

                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool SavePhoneList(BlackListRequest blacklistfile)
        {
            try
            {
                using (var ctx = new Entities())
                {

                    var entidades = blacklistfile.Phones
                        .Distinct()
                        .Select(t => new BlackList
                        {
                            Name = blacklistfile.Name,
                            phone = t,
                            ExpirationDate = blacklistfile.ExpirationDate,
                            IdUser = blacklistfile.IdUser,
                            CreationDate = DateTime.Now
                        }).ToList();

                    ctx.BlackList.AddRange(entidades);
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
