using System.Data.Entity;

namespace Formhandling.Models
{
    public class ContactsAPIDbContext : DbContext
    {
        public ContactsAPIDbContext() : base("name=DefaultConnection")
        {
        }

        public DbSet<Contact> Contacts { get; set; }
    }
}
