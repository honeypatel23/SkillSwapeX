using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.LearningSession;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearningSessionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LearningSessionValidator _validator;

        public LearningSessionController(
            ApplicationDbContext context,
            LearningSessionValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _context.LearningSessions.ToListAsync();
            return Ok(sessions);
        }

        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionById(int id)
        {
            var session = await _context.LearningSessions.FindAsync(id);
            if (session == null)
                return NotFound("Learning session not found");

            return Ok(session);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> CreateSession([FromBody] LearningSessionDto dto)
        {
            dto.SessionId = 0; // IMPORTANT: Create

            // Validate
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            // FK CHECK: ServiceRequest must exist
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);

            if (!requestExists)
                return BadRequest("Invalid RequestId");

            var session = new LearningSessionModel
            {
                RequestId = dto.RequestId,
                SessionType = dto.SessionType,
                MeetingLink = dto.MeetingLink,
                SessionDate = dto.SessionDate,
                Status = dto.Status ?? "Scheduled",
                MeetingPlatform = dto.MeetingPlatform
            };

            _context.LearningSessions.Add(session);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSessionById),
                new { id = session.SessionId },
                session);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] LearningSessionDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid SessionId.");

            dto.SessionId = id;

            // Validate
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            var existingSession = await _context.LearningSessions.FindAsync(id);
            if (existingSession == null)
                return NotFound("Learning session not found");

            // FK CHECK
            bool requestExists = await _context.ServiceRequests
                .AnyAsync(r => r.RequestId == dto.RequestId);

            if (!requestExists)
                return BadRequest("Invalid RequestId");

            existingSession.RequestId = dto.RequestId;
            existingSession.SessionType = dto.SessionType;
            existingSession.MeetingLink = dto.MeetingLink;
            existingSession.SessionDate = dto.SessionDate;
            existingSession.Status = dto.Status;
            existingSession.MeetingPlatform = dto.MeetingPlatform;

            await _context.SaveChangesAsync();

            return Ok(existingSession);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.LearningSessions.FindAsync(id);
            if (session == null)
                return NotFound("Learning session not found");

            _context.LearningSessions.Remove(session);
            await _context.SaveChangesAsync();

            return Ok("Learning session deleted successfully");
        }
    }
}
