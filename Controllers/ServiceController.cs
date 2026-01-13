using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.Service;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ServiceValidator _validator;

        public ServicesController(
            ApplicationDbContext context,
            ServiceValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.Services.ToListAsync());

        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var service = await _context.Services.FindAsync(id);
            return service == null ? NotFound() : Ok(service);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create(ServiceDto dto)
        {
            dto.ServiceId = 0; // IMPORTANT: Create

            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid)
                return BadRequest(result.Errors);

            var service = new ServiceModel
            {
                UserId = dto.UserId,
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Description = dto.Description,
                ServiceType = dto.ServiceType,
                RequiredCredits = dto.RequiredCredits,
                WorkDetails = dto.WorkDetails,
                City = dto.City,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return Ok(service);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ServiceDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid ServiceId.");

            dto.ServiceId = id; // IMPORTANT: Update

            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid)
                return BadRequest(result.Errors);

            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            service.UserId = dto.UserId;
            service.CategoryId = dto.CategoryId;
            service.Title = dto.Title;
            service.Description = dto.Description;
            service.RequiredCredits = dto.RequiredCredits;
            service.ServiceType = dto.ServiceType;
            service.WorkDetails = dto.WorkDetails;
            service.Status = dto.Status;
            service.City = dto.City;

            await _context.SaveChangesAsync();
            return Ok(service);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return Ok("Service deleted successfully");
        }
    }
}
