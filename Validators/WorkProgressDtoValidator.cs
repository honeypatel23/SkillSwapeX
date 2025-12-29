using FluentValidation;
using SkillSwape.DTOs.WorkProgress;

namespace SkillSwape.Validators
{
    public class WorkProgressDtoValidator : AbstractValidator<WorkProgressDto>
    {
        public WorkProgressDtoValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId is required.");

            RuleFor(x => x.UpdatedById)
                .GreaterThan(0).WithMessage("UpdatedById is required.");

            RuleFor(x => x.ProgressPercent)
                .InclusiveBetween(0, 100).WithMessage("Progress percent must be between 0 and 100.");
        }
    }
}
