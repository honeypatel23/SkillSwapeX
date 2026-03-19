using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSwape.Models
{
    public class CreditTransactionModel
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [Required]
        public int Credits { get; set; }

        [Required]
        public string TransactionType { get; set; } // Credit / Debit

        [Required]
        public DateTime CreatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(UserId))]
        public UserModel User { get; set; }

        [ForeignKey(nameof(RequestId))]
        public ServiceRequestModel ServiceRequest { get; set; }

    }
}
