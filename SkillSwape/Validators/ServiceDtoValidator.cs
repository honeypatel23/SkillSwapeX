using FluentValidation;
using SkillSwape.DTOs.Service;

namespace SkillSwape.Validators
{
    public class ServiceValidator : AbstractValidator<ServiceDto>
    {
        public ServiceValidator()
        {
            RuleFor(x => x.ServiceId)
                .GreaterThanOrEqualTo(0).WithMessage("ServiceId cannot be negative.");

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("Valid UserId is required.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Valid CategoryId is required.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(150).WithMessage("Title cannot exceed 150 characters.");

            RuleFor(x => x.ServiceType)
                .NotEmpty().WithMessage("Service Type is required.");

            RuleFor(x => x.RequiredCredits)
                .GreaterThanOrEqualTo(0).WithMessage("RequiredCredits must be 0 or more.");

            RuleFor(x => x.City)
                .MaximumLength(50).WithMessage("City cannot exceed 50 characters.");
        }
    }
}
