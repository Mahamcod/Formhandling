

using System.Linq;
using System.Web.Mvc;
using Formhandling.Models;

namespace Formhandling.Controllers
{
    public class ContactController : Controller
    {
        private ContactsAPIDbContext _db;

        public ContactController()
        {
            _db = new ContactsAPIDbContext();
        }

        public ActionResult Index()
        {
            var contacts = _db.Contacts.ToList();
            return View(contacts);
        }

        [HttpPost]
        public JsonResult AddContacts(Contact contact)
        {
            if (ModelState.IsValid)
            {
                _db.Contacts.Add(contact);
                _db.SaveChanges();

                return Json(new { success = true, message = "Contact added successfully.", contact = contact });
            }

            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToArray();
            return Json(new { success = false, message = "Invalid data.", errors = errors });
        }
    }
}
