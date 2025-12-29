using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.ServiceRequest;
using SkillSwape.Models;
using SkillSwape.Services;

namespace SkillSwape.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IValidator<ServiceRequestDto> _validator;

        public ServiceRequestsController(ApplicationDbContext context, IValidator<ServiceRequestDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.ServiceRequests.ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create(ServiceRequestDto dto)
        {
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
                Status = dto.Status,
                RequestedAt = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ServiceRequestDto dto)
        {
            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid) return BadRequest(result.Errors);

            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound();

            request.Status = dto.Status;
            request.CompletedAt = dto.CompletedAt;

            await _context.SaveChangesAsync();
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound();

            _context.ServiceRequests.Remove(request);
            await _context.SaveChangesAsync();
            return Ok("Request deleted");
        }
    }
}