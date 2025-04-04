﻿using Contract;
using Microsoft.EntityFrameworkCore;
using Modal.Model;
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
        public DbSet<clients> clients { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<roomsbyuser> roomsbyuser { get; set; }
        public DbSet<creditcards> creditcards { get; set; }
        public DbSet<MyNumbers> MyNumbers { get; set; }
        public DbSet<BillingInformation> BillingInformation { get; set; }
        public DbSet<CreditRecharge> CreditRecharge { get; set; }

        public DbSet<AmountNotification> AmountNotification { get; set; }
        public DbSet<AmountNotificationUser> AmountNotificationUser { get; set; }
    }
}
