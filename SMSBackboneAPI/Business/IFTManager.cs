using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Modal;
using Modal.Model.Model;
using CsvHelper;
using Contract.Other;
namespace Business
{
    public class IFTManager
    {
        public bool LoadFromCsv(string filePath)
        {
            try
            {
                var lines = File.ReadAllLines(filePath);

                foreach (var line in lines)
                {
                    if (line.StartsWith("CLAVE_CENSAL"))
                    {
                        continue;
                    }
                    var columns = line.Split(',');

                    if (columns.Length < 4) continue;

                    string claveLada = columns[6];
                    var municipio = columns[2].Trim().Trim('"'); ;
                    var estado = columns[3].Trim().Trim('"'); ;

                    string estadoCompleto = StatesMap.ObtenerNombreCompleto(estado);
                    var entidad = new IFTLadas
                    {
                        ClaveLada = claveLada,
                        Estado = estadoCompleto,
                        Municipio = municipio
                    };

                    using (var ctx = new Entities())
                    {
                        ctx.IFTLadas.Add(entidad);
                        ctx.SaveChanges();
                    }
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
