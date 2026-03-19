using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwape.DTOs.User;
using SkillSwape.Models;
using SkillSwape.Services;

namespace SkillSwape.Controllers
{
    [Authorize(Roles = "Admin")]

    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.Select(u => new UserDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                City = u.City,
                TotalCredits = u.TotalCredits
            }).ToList();

            return Ok(users);
        }

        [HttpPut("{id}/role")]
        public IActionResult UpdateUserRole(int id, [FromBody] string role)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            user.Role = role;
            _context.SaveChanges();

            return Ok("Role updated");
        }
    }
}
