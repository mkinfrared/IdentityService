using System;

using Microsoft.AspNetCore.Identity;

namespace IdentityService.Entities;

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
}
