using FluentValidation;
using SkillSwape.DTOs.WorkSubmission;

namespace SkillSwape.Validators
{
    public class WorkSubmissionValidator : AbstractValidator<WorkSubmissionDto>
    {
        public WorkSubmissionValidator()
        {
            RuleFor(x => x.SubmissionId)
                .GreaterThanOrEqualTo(0).WithMessage("SubmissionId cannot be negative.");

            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("RequestId is required.");

            RuleFor(x => x.Remarks)
                .MaximumLength(300).WithMessage("Remarks cannot exceed 300 characters.");
        }
    }
}
