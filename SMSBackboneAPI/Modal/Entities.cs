using Contract;
using Microsoft.EntityFrameworkCore;
using Modal.Model.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modal
{
    public class Entities : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var conn = Common.ConfigurationManagerJson("ConnectionStrings:Conexion");
            optionsBuilder.UseSqlServer(conn);
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<Users> Users { get; set; }
        public DbSet<UserAccounRecovery> UserAccounRecovery { get; set; }
        public DbSet<rooms> Rooms { get; set; }
    }
}
