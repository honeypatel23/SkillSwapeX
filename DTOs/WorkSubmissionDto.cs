using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.WorkSubmission
{
    public class WorkSubmissionDto
    {
        // Used for Update / Get
        public int SubmissionId { get; set; }

        public int RequestId { get; set; }

        public string? FileUrl { get; set; }

        public string? Remarks { get; set; }

        // Set automatically during CREATE
        public DateTime SubmittedAt { get; set; }
    }
}
