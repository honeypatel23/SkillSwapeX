using FluentValidation;
using SkillSwape.DTOs.ServiceRequest;

namespace SkillSwape.Validators
{
    public class ServiceRequestDtoValidator : AbstractValidator<ServiceRequestDto>
    {
        public ServiceRequestDtoValidator()
        {
            RuleFor(x => x.ServiceId)
                .GreaterThan(0).WithMessage("ServiceId is required.");

            RuleFor(x => x.RequestedById)
                .GreaterThan(0).WithMessage("RequestedById is required.");

            RuleFor(x => x.RequestedToId)
                .GreaterThan(0).WithMessage("RequestedToId is required.");

            RuleFor(x => x.TotalSessions)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.TotalCredits)
                .GreaterThanOrEqualTo(0);
        }
    }
}
