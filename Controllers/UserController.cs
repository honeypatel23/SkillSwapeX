using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs.User;
using SkillSwape.Models;
using SkillSwape.Services;
using SkillSwape.Validators;

namespace SkillSwape.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserValidator _validator;

        public UsersController(
            ApplicationDbContext context,
            UserValidator validator)
        {
            _context = context;
            _validator = validator;
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // ================= GET BY ID =================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // ================= CREATE =================
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserDto dto)
        {
            dto.UserId = 0; // IMPORTANT: Create

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            // Check email uniqueness
            bool emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailExists)
                return Conflict("Email already exists");

            var user = new UserModel
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = dto.Password, // TODO: Hash later
                City = dto.City,
                ProfileImage = dto.ProfileImage,
                Bio = dto.Bio,
                TotalCredits = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.UserId }, user);
        }

        // ================= UPDATE =================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserDto dto)
        {
            if (id <= 0)
                return BadRequest("Invalid UserId.");

            dto.UserId = id; // IMPORTANT: Update

            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
                return BadRequest(validationResult.Errors);

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return NotFound("User not found");

            existingUser.FullName = dto.FullName;
            existingUser.Email = dto.Email;
            existingUser.City = dto.City;
            existingUser.ProfileImage = dto.ProfileImage;
            existingUser.Bio = dto.Bio;
            existingUser.TotalCredits = dto.TotalCredits;

            // Update password ONLY if provided
            if (!string.IsNullOrWhiteSpace(dto.Password))
                existingUser.Password = dto.Password; // TODO: Hash later

            await _context.SaveChangesAsync();
            return Ok(existingUser);
        }

        // ================= DELETE =================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("User deleted successfully");
        }
    }
}
