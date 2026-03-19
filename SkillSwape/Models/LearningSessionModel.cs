using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSwape.Models
{
    public class LearningSessionModel
    {
        [Key]
        public int SessionId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Required]
        public string SessionType { get; set; }

        public string MeetingLink { get; set; }

        [Required]
        public DateTime SessionDate { get; set; }

        public string Status { get; set; }

        public string MeetingPlatform { get; set; }

        // Navigation
        [ForeignKey(nameof(RequestId))]
        public ServiceRequestModel ServiceRequest { get; set; }
    }
}

