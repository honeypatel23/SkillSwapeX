using System.ComponentModel.DataAnnotations;

namespace SkillSwape.DTOs.CreditTransaction
{
    public class CreditTransactionDto
    {
        // Used for Update / Get
        public int TransactionId { get; set; }

      
        public int UserId { get; set; }

        
        public int RequestId { get; set; }

       
        public int Credits { get; set; }

      
        public string TransactionType { get; set; } // Credit / Debit

        // Set automatically during CREATE
        public DateTime CreatedAt { get; set; }
    }
}
