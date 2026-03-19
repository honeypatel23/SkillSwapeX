using FluentValidation;
using SkillSwape.DTOs.User;

namespace SkillSwape.Validators
{
    public class UserValidator : AbstractValidator<UserDto>
    {
        public UserValidator()
        {
            //   (Create + Update)
            RuleFor(x => x.FullName).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Full Name is required.")
                .MaximumLength(100).WithMessage("Full Name cannot exceed 100 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email address.");

            RuleFor(x => x.City)
                .MaximumLength(50).WithMessage("City cannot exceed 50 characters.");

            RuleFor(x => x.Bio)
                .MaximumLength(500).WithMessage("Bio cannot exceed 500 characters.");
            RuleFor(x => x.Role)
    .Must(r => r == null || r == "User" || r == "Admin")
    .WithMessage("Role must be User or Admin");


            // PK RULE (Create vs Update)
            RuleFor(x => x.UserId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("UserId cannot be negative.");

            //  CREATE
            When(x => x.UserId == 0, () =>
            {
                RuleFor(x => x.Password)
                    .NotEmpty().WithMessage("Password is required for new users.")
                    .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
            });

            //  UPDATE 
            When(x => x.UserId > 0, () =>
            {
                RuleFor(x => x.Password)
                    .MinimumLength(6)
                    .When(x => !string.IsNullOrWhiteSpace(x.Password))
                    .WithMessage("Password must be at least 6 characters if provided.");
            });
        }
    }
}
