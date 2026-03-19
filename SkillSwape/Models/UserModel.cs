using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SkillSwape.Models
{
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }


        [Required, MaxLength(100)]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = "User";


        [MaxLength(50)]
        public string City { get; set; }

        public string? ProfileImage { get; set; }

        public int TotalCredits { get; set; }

        [MaxLength(500)]
        public string Bio { get; set; }

       
        public DateTime CreatedAt { get; set; }
        //  Navigation Collections

        [JsonIgnore]
        public ICollection<ServiceModel> Services { get; set; } = new List<ServiceModel>();

        [JsonIgnore]
        public ICollection<ServiceRequestModel> RequestsMade { get; set; } = new List<ServiceRequestModel>();

        [JsonIgnore]
        public ICollection<ServiceRequestModel> RequestsReceived { get; set; } = new List<ServiceRequestModel>();

        [JsonIgnore]
        public ICollection<CreditTransactionModel> CreditTransactions { get; set; } = new List<CreditTransactionModel>();

        [JsonIgnore]
        public ICollection<WorkProgressModel> WorkProgressUpdates { get; set; } = new List<WorkProgressModel>();

    }
}

