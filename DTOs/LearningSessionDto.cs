using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.LearningSession
{
    public class LearningSessionDto
    {
        // Used for Update / Get
        public int SessionId { get; set; }

       
        public int RequestId { get; set; }

       
        public string SessionType { get; set; }   // Online / Offline

        public string? MeetingLink { get; set; }

       
        public DateTime SessionDate { get; set; }

        public string? Status { get; set; }       // Scheduled / Completed / Cancelled

        public string? MeetingPlatform { get; set; }
    }
}
