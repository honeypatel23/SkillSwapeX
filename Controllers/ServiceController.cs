using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.Service;
using SkillSwape.Models;
using SkillSwape.Services;

namespace SkillSwape.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IValidator<ServiceDto> _validator;

        public ServicesController(ApplicationDbContext context, IValidator<ServiceDto> validator)
        {
            _context = context;
            _validator = validator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _context.Services.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var service = await _context.Services.FindAsync(id);
            return service == null ? NotFound() : Ok(service);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ServiceDto dto)
        {
            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid) return BadRequest(result.Errors);

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
                Status = dto.Status,
                CreatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return Ok(service);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ServiceDto dto)
        {
            var result = await _validator.ValidateAsync(dto);
            if (!result.IsValid) return BadRequest(result.Errors);

            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            service.Title = dto.Title;
            service.Description = dto.Description;
            service.RequiredCredits = dto.RequiredCredits;
            service.Status = dto.Status;
            service.City = dto.City;

            await _context.SaveChangesAsync();
            return Ok(service);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return Ok("Service deleted");
        }
    }
}
