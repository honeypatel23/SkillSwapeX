using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.Service
{
    public class ServiceDto
    {
        // Used for Update / Get
        public int ServiceId { get; set; }

        public int UserId { get; set; }

        public int CategoryId { get; set; }

        public string Title { get; set; }

        public string? Description { get; set; }

        
        public string ServiceType { get; set; } // Learning / Work

        public int RequiredCredits { get; set; }

        public string? WorkDetails { get; set; }

     
        public string? City { get; set; }

        public string? Status { get; set; }

        // Set automatically during CREATE
        public DateTime CreatedAt { get; set; }
    }
}
