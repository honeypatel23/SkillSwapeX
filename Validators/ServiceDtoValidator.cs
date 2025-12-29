using FluentValidation;
using SkillSwape.DTOs.Service;

namespace SkillSwape.Validators
{
    public class ServiceDtoValidator : AbstractValidator<ServiceDto>
    {
        public ServiceDtoValidator()
        {
            RuleFor(x => x.UserId).GreaterThan(0);
            RuleFor(x => x.CategoryId).GreaterThan(0);

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(150);

            RuleFor(x => x.ServiceType)
                .NotEmpty().WithMessage("Service Type is required.");

            RuleFor(x => x.RequiredCredits)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.City).MaximumLength(50);
        }
    }
}
