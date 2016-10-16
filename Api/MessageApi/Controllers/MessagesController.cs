using System.Threading;
using MessageApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MessageApi.Controllers
{
    // Todo: instead of a RESTy api, it could be better to have a single
    // endpoint that accepts a tree representing the data the app needs
    // and a list of commands/actions/transactions.
    // This would save time/bandwidth for the clients.
    [Route("api/[controller]/[action]")]
    public class MessagesController : Controller
    {
        [HttpPost]
        public IActionResult Add([FromBody] Message message) {
            // Todo: remove sleep. This is just so we can see the animations in the app.
            Thread.Sleep(1000);

            // Todo: Put this somewhere appropriate.
            // - Query & Command seperation.
            // - IOC
            using (var db = new Context()){
                db.Message.Add(message);
                db.SaveChanges();
            }
            return Ok(message);
        }
    }
}