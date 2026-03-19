using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwape.DTOs.Admin;
using SkillSwape.Models;
using SkillSwape.Services;

namespace SkillSwape.Controllers
{
    [Authorize(Roles = "Admin")]

    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public IActionResult GetDashboardStats()
        {
            var dashboard = new AdminDashboardDto
            {
                TotalUsers = _context.Users.Count(),
                TotalCategories = _context.Categories.Count(),
                TotalServices = _context.Services.Count(),
                TotalServiceRequests = _context.ServiceRequests.Count()
            };

            return Ok(dashboard);
        }
    }
}
