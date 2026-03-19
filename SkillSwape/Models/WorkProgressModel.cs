using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSwape.Models
{
    public class WorkProgressModel
    {
        [Key]
        public int ProgressId { get; set; }

        [Required]
        public int RequestId { get; set; }

        public string Description { get; set; }

        [Range(0, 100)]
        public int ProgressPercent { get; set; }

        [Required]
        public int UpdatedById { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(RequestId))]
        public ServiceRequestModel ServiceRequest { get; set; }

        [ForeignKey(nameof(UpdatedById))]
        public UserModel UpdatedBy { get; set; }
        
    }
}
