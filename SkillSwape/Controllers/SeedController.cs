using Microsoft.AspNetCore.Mvc;
using SkillSwape.Models;
using SkillSwape.Services;
using Microsoft.EntityFrameworkCore;

namespace SkillSwape.Controllers
{
    [ApiController]
    [Route("api/seed")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SeedUsers()
        {
            var adminEmail = "admin@test.com";
            var userEmail = "user@test.com";

            var usersAdded = false;

            // Check and Add Admin
            if (!await _context.Users.AnyAsync(u => u.Email == adminEmail))
            {
                _context.Users.Add(new UserModel
                {
                    FullName = "System Admin",
                    Email = adminEmail,
                    Password = "1234", // Plain text as per current AuthController
                    Role = "Admin",
                    City = "Tech City",
                    Bio = "Administrator Account",
                    CreatedAt = DateTime.Now,
                    TotalCredits = 1000
                });
                usersAdded = true;
            }

            // Check and Add User
            if (!await _context.Users.AnyAsync(u => u.Email == userEmail))
            {
                _context.Users.Add(new UserModel
                {
                    FullName = "Demo User",
                    Email = userEmail,
                    Password = "1234",
                    Role = "User",
                    City = "Skill Town",
                    Bio = "Regular User Account",
                    CreatedAt = DateTime.Now,
                    TotalCredits = 50
                });
                usersAdded = true;
            }

            if (usersAdded)
            {
                await _context.SaveChangesAsync();
                return Ok("Database seeded with default users (Admin & User).");
            }

            return Ok("Users already exist. No changes made.");
        }
    }
}
