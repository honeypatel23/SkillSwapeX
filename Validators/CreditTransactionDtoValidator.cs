using FluentValidation;
using SkillSwape.DTOs.CreditTransaction;

namespace SkillSwape.Validators
{
    public class CreditTransactionValidator : AbstractValidator<CreditTransactionDto>
    {
        public CreditTransactionValidator()
        {
            RuleFor(x => x.TransactionId)
                .GreaterThanOrEqualTo(0).WithMessage("TransactionId cannot be negative.");

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("UserId must be greater than 0.");

            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId must be greater than 0.");

            RuleFor(x => x.Credits)
                .GreaterThanOrEqualTo(0).WithMessage("Credits must be 0 or more.");

            RuleFor(x => x.TransactionType)
                .NotEmpty().WithMessage("Transaction Type is required.");
        }
    }
}
