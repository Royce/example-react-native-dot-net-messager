using MessageApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MessageApi
{
    public class Context : DbContext
    {
        public DbSet<Message> Message { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite("Filename=Messages.db");
        }
    }
}