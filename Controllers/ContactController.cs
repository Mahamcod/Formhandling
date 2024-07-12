
using System;
using System.Data.Entity;
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
        [HttpDelete]
        public ActionResult DeleteContact(int id)
        {
            try
            {
                var contact = _db.Contacts.Find(id);
                if (contact == null)
                {
                    return Json(new { success = false, message = "Contact not found" });
                }

                _db.Contacts.Remove(contact);
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }



        [HttpPut]
        public ActionResult EditContact(Contact contact)
        {
            if (ModelState.IsValid)
            {
                var existingContact = _db.Contacts.Find(contact.Id);
                if (existingContact != null)
                {
                    existingContact.Name = contact.Name;
                    existingContact.Email = contact.Email;
                    existingContact.Phone = contact.Phone;
                    existingContact.Address = contact.Address;
                    existingContact.City = contact.City;

                    _db.Entry(existingContact).State = EntityState.Modified;
                    _db.SaveChanges();

                    return Json(new { success = true, message = "Contact updated successfully.", contact = existingContact });
                }
                return Json(new { success = false, message = "Contact not found." });
            }
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToArray();
            return Json(new { success = false, message = "Invalid data.", errors = errors });
        }






    }
}

















