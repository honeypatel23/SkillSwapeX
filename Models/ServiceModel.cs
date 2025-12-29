using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkillSwape.Models
{
    public class ServiceModel
    {
        [Key]
        public int ServiceId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required, MaxLength(150)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string ServiceType { get; set; } // Learning / Work

        [Required]
        public int RequiredCredits { get; set; }

        public string WorkDetails { get; set; }

        [MaxLength(50)]
        public string City { get; set; }

        public string Status { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(UserId))]
        public UserModel User { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public CategoryModel Category { get; set; }
        
        [JsonIgnore]

        public ICollection<ServiceRequestModel> ServiceRequests { get; set; }
    }
}

