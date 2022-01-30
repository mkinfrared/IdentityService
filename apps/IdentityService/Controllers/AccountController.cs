using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers;

public class AccountController : Controller
{
  [HttpGet]
  public IActionResult Login()
  {
    return View();
  }

  [HttpGet]
  public IActionResult Register()
  {
    return View();
  }

  [HttpGet]
  public IActionResult ConfirmEmail()
  {
    return View("Login");
  }
}
