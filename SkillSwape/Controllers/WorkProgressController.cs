using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.WorkProgress;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkProgressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly WorkProgressValidator _validator;

        public WorkProgressController(
            ApplicationDbContext context,
            WorkProgressValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAllProgress()
        {
            var progress = await _context.WorkProgresses.ToListAsync();
            return Ok(progress);
        }

        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProgressById(int id)
        {
            var progress = await _context.WorkProgresses.FindAsync(id);
            if (progress == null)
                return NotFound("Work progress not found");

            return Ok(progress);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> CreateProgress([FromBody] WorkProgressDto dto)
        {
            dto.ProgressId = 0; // IMPORTANT: Create

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            // 🔒 FK SAFETY CHECKS
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);
            if (!requestExists) return BadRequest("Invalid RequestId");

            bool userExists = await _context.Users
                .AnyAsync(u => u.UserId == dto.UpdatedById);
            if (!userExists) return BadRequest("Invalid UpdatedById");

            var progress = new WorkProgressModel
            {
                RequestId = dto.RequestId,
                Description = dto.Description,
                ProgressPercent = dto.ProgressPercent,
                UpdatedById = dto.UpdatedById,
                UpdatedAt = DateTime.UtcNow
            };

            _context.WorkProgresses.Add(progress);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProgressById),
                new { id = progress.ProgressId }, progress);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProgress(int id, [FromBody] WorkProgressDto dto)
        {
            if (id <= 0) return BadRequest("Invalid ProgressId.");

            dto.ProgressId = id; // IMPORTANT: Update

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            var existingProgress = await _context.WorkProgresses.FindAsync(id);
            if (existingProgress == null)
                return NotFound("Work progress not found");

            // 🔒 FK SAFETY
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);
            if (!requestExists) return BadRequest("Invalid RequestId");

            bool userExists = await _context.Users
                .AnyAsync(u => u.UserId == dto.UpdatedById);
            if (!userExists) return BadRequest("Invalid UpdatedById");

            existingProgress.RequestId = dto.RequestId;
            existingProgress.Description = dto.Description;
            existingProgress.ProgressPercent = dto.ProgressPercent;
            existingProgress.UpdatedById = dto.UpdatedById;
            existingProgress.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(existingProgress);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgress(int id)
        {
            var progress = await _context.WorkProgresses.FindAsync(id);
            if (progress == null)
                return NotFound("Work progress not found");

            _context.WorkProgresses.Remove(progress);
            await _context.SaveChangesAsync();

            return Ok("Work progress deleted successfully");
        }
    }
}
