using FluentValidation;
using SkillSwape.DTOs.LearningSession;

namespace SkillSwape.Validators
{
    public class LearningSessionDtoValidator : AbstractValidator<LearningSessionDto>
    {
        public LearningSessionDtoValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId is required.");

            RuleFor(x => x.SessionType)
                .NotEmpty().WithMessage("Session Type is required.");

            RuleFor(x => x.SessionDate)
                .NotEmpty().WithMessage("Session Date is required.");
        }
    }
}
