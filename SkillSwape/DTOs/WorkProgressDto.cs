using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.WorkProgress
{
    public class WorkProgressDto
    {
        // Used for Update / Get
        public int ProgressId { get; set; }

        public int RequestId { get; set; }

        public string? Description { get; set; }

        public int ProgressPercent { get; set; }

        public int UpdatedById { get; set; }

        // Set automatically during CREATE / UPDATE
        public DateTime UpdatedAt { get; set; }
    }
}
