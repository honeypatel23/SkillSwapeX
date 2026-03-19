using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSwape.Models
{
    public class WorkSubmissionModel
    {
        [Key]
        public int SubmissionId { get; set; }

        [Required]
        public int RequestId { get; set; }

        public string FileUrl { get; set; }

        [MaxLength(300)]
        public string Remarks { get; set; }

        [Required]
        public DateTime SubmittedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(RequestId))]
        public ServiceRequestModel ServiceRequest { get; set; }
        
    }
}
