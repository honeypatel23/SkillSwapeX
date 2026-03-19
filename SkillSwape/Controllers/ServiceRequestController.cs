using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.ServiceRequest;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ServiceRequestValidator _validator;

        public ServiceRequestsController(
            ApplicationDbContext context,
            ServiceRequestValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.ServiceRequests.ToListAsync());

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ServiceRequestDto dto)
        {
            dto.RequestId = 0; // IMPORTANT: Create

            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid) return BadRequest(result.Errors);

            var request = new ServiceRequestModel
            {
                ServiceId = dto.ServiceId,
                RequestedById = dto.RequestedById,
                RequestedToId = dto.RequestedToId,
                Mode = dto.Mode,
                TotalSessions = dto.TotalSessions,
                TotalCredits = dto.TotalCredits,
                Status = "Pending",
                RequestedAt = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ServiceRequestDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid RequestId.");

            dto.RequestId = id; // IMPORTANT: Update

            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid) return BadRequest(result.Errors);

            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound();

            // Only updating fields allowed to change
            request.Status = dto.Status;
            request.CompletedAt = dto.CompletedAt;

            await _context.SaveChangesAsync();
            return Ok(request);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound();

            _context.ServiceRequests.Remove(request);
            await _context.SaveChangesAsync();
            return Ok("Request deleted successfully");
        }
    }
}
