using FluentValidation;
using SkillSwape.DTOs.LearningSession;

namespace SkillSwape.Validators
{
    public class LearningSessionValidator : AbstractValidator<LearningSessionDto>
    {
        public LearningSessionValidator()
        {
            RuleFor(x => x.SessionId)
                .GreaterThanOrEqualTo(0).WithMessage("SessionId cannot be negative.");

            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId is required.");

            RuleFor(x => x.SessionType)
                .NotEmpty().WithMessage("Session Type is required.");

            RuleFor(x => x.SessionDate)
                .NotEmpty().WithMessage("Session Date is required.");
        }
    }
}
