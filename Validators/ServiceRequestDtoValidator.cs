using FluentValidation;
using SkillSwape.DTOs.ServiceRequest;

namespace SkillSwape.Validators
{
    public class ServiceRequestValidator : AbstractValidator<ServiceRequestDto>
    {
        public ServiceRequestValidator()
        {
            RuleFor(x => x.RequestId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("RequestId cannot be negative.");

            //  CREATE RULES 
            When(x => x.RequestId == 0, () =>
            {
                RuleFor(x => x.ServiceId)
                    .GreaterThan(0).WithMessage("ServiceId is required.");

                RuleFor(x => x.RequestedById)
                    .GreaterThan(0).WithMessage("RequestedById is required.");

                RuleFor(x => x.RequestedToId)
                    .GreaterThan(0).WithMessage("RequestedToId is required.");

                RuleFor(x => x.Mode)
                    .NotEmpty().WithMessage("Mode is required.")
                    .Must(x => x == "Online" || x == "Offline")
                    .WithMessage("Mode must be either 'Online' or 'Offline'.");

                RuleFor(x => x.TotalSessions)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("TotalSessions must be 0 or more.");

                RuleFor(x => x.TotalCredits)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("TotalCredits must be 0 or more.");
            });

            // ================= UPDATE RULES =================
            When(x => x.RequestId > 0, () =>
            {
                RuleFor(x => x.Status)
                    .NotEmpty()
                    .WithMessage("Status is required for update.");
            });
        }
    }
}
