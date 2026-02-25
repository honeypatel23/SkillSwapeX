using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.User
{
    public class UserDto
    {
        // Used only for Update / Get
        public int UserId { get; set; }

        
        public string FullName { get; set; }

        
        public string Email { get; set; }

        // Required only while creating (handle via validator)
        public string? Password { get; set; }

        public string? City { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        public int TotalCredits { get; set; }
        public string? Role { get; set; } //admin or user 

    }
}
