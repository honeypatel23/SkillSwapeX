using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.LearningSession;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [Authorize]
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

        //  GET ALL 
        [HttpGet]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _context.LearningSessions.ToListAsync();
            return Ok(sessions);
        }

        //  GET BY ID 
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionById(int id)
        {
            var session = await _context.LearningSessions.FindAsync(id);
            if (session == null)
                return NotFound("Learning session not found");

            return Ok(session);
        }

        //  CREATE 
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

        //  UPDATE 
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
            var serviceRequest = await _context.ServiceRequests
                .FirstOrDefaultAsync(r => r.RequestId == dto.RequestId);

            if (serviceRequest == null)
                return BadRequest("Invalid RequestId");

            // Store old status to check if it's changing to Completed
            string oldStatus = existingSession.Status;

            // Update fields
            existingSession.RequestId = dto.RequestId;
            existingSession.SessionType = dto.SessionType;
            existingSession.MeetingLink = dto.MeetingLink;
            existingSession.SessionDate = dto.SessionDate;
            existingSession.Status = dto.Status;
            existingSession.MeetingPlatform = dto.MeetingPlatform;

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // If status changed to Completed, process credit transfer
                if (oldStatus != "Completed" && existingSession.Status == "Completed")
                {
                    // Fetch requester and provider
                    var requester = await _context.Users.FindAsync(serviceRequest.RequestedById);
                    var provider = await _context.Users.FindAsync(serviceRequest.RequestedToId);

                    if (requester != null && provider != null && serviceRequest.TotalSessions > 0)
                    {
                        // Calculate credits per session (rounded to nearest integer or kept as is if TotalCredits is int)
                        int creditsPerSession = serviceRequest.TotalCredits / serviceRequest.TotalSessions;

                        // Deduct from requester (allow negative or check if they have enough? Assuming deduction is allowed or happens at end)
                        requester.TotalCredits -= creditsPerSession;
                        // Add to provider
                        provider.TotalCredits += creditsPerSession;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while updating the session.");
            }

            return Ok(existingSession);
        }

        //  DELETE 
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
