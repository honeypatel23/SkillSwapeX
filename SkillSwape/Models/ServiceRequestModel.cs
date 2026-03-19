using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SkillSwape.Models
{
    public class ServiceRequestModel
    {
        [Key]
        public int RequestId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public int RequestedById { get; set; }

        [Required]
        public int RequestedToId { get; set; }

        public string Mode { get; set; }

        public int TotalSessions { get; set; }

        public int TotalCredits { get; set; }

        public string Status { get; set; }

        [Required]
        public DateTime RequestedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(ServiceId))]
        public ServiceModel Service { get; set; }

        [ForeignKey(nameof(RequestedById))]
        public UserModel RequestedBy { get; set; }

        [ForeignKey(nameof(RequestedToId))]
        public UserModel RequestedTo { get; set; }

        public ICollection<CreditTransactionModel> CreditTransactions { get; set; }
        [JsonIgnore]
        public ICollection<LearningSessionModel> LearningSessions { get; set; }

        [JsonIgnore]
        public ICollection<WorkProgressModel> WorkProgresses { get; set; }

        [JsonIgnore]
        public ICollection<WorkSubmissionModel> WorkSubmissions { get; set; }
    }
}


