using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.ServiceRequest
{
    public class ServiceRequestDto
    {
        // Used for Update / Get
        public int RequestId { get; set; }

        public int ServiceId { get; set; }

        public int RequestedById { get; set; }

        public int RequestedToId { get; set; }

        public string? Mode { get; set; }

        public int TotalSessions { get; set; }

        public int TotalCredits { get; set; }

        public string? Status { get; set; }

        // Set automatically on CREATE
        public DateTime RequestedAt { get; set; }

        public DateTime? CompletedAt { get; set; }
    }
}
