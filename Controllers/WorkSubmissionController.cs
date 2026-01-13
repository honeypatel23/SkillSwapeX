using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.WorkSubmission;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkSubmissionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly WorkSubmissionValidator _validator;

        public WorkSubmissionController(
            ApplicationDbContext context,
            WorkSubmissionValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _context.WorkSubmissions.ToListAsync();
            return Ok(submissions);
        }

        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            var submission = await _context.WorkSubmissions.FindAsync(id);
            if (submission == null)
                return NotFound("Work submission not found");

            return Ok(submission);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> CreateSubmission([FromBody] WorkSubmissionDto dto)
        {
            dto.SubmissionId = 0; // IMPORTANT: Create

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            // 🔒 FK CHECK: ServiceRequest must exist
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);
            if (!requestExists) return BadRequest("Invalid RequestId");

            var submission = new WorkSubmissionModel
            {
                RequestId = dto.RequestId,
                FileUrl = dto.FileUrl,
                Remarks = dto.Remarks,
                SubmittedAt = DateTime.UtcNow
            };

            _context.WorkSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubmissionById),
                new { id = submission.SubmissionId }, submission);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, [FromBody] WorkSubmissionDto dto)
        {
            if (id <= 0) return BadRequest("Invalid SubmissionId.");

            dto.SubmissionId = id; // IMPORTANT: Update

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            var existingSubmission = await _context.WorkSubmissions.FindAsync(id);
            if (existingSubmission == null)
                return NotFound("Work submission not found");

            // 🔒 FK CHECK
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);
            if (!requestExists) return BadRequest("Invalid RequestId");

            existingSubmission.RequestId = dto.RequestId;
            existingSubmission.FileUrl = dto.FileUrl;
            existingSubmission.Remarks = dto.Remarks;

            await _context.SaveChangesAsync();
            return Ok(existingSubmission);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            var submission = await _context.WorkSubmissions.FindAsync(id);
            if (submission == null)
                return NotFound("Work submission not found");

            _context.WorkSubmissions.Remove(submission);
            await _context.SaveChangesAsync();

            return Ok("Work submission deleted successfully");
        }
    }
}

