using FluentValidation;
using SkillSwape.DTOs.WorkSubmission;

namespace SkillSwape.Validators
{
    public class WorkSubmissionDtoValidator : AbstractValidator<WorkSubmissionDto>
    {
        public WorkSubmissionDtoValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId is required.");

            RuleFor(x => x.Remarks)
                .MaximumLength(300).WithMessage("Remarks cannot exceed 300 characters.");
        }
    }
}
