using FluentValidation;
using SkillSwape.DTOs.User;

namespace SkillSwape.Validators
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full Name is required.")
                .MaximumLength(100).WithMessage("Full Name cannot exceed 100 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email address.");

            RuleFor(x => x.Password)
                .NotEmpty().When(x => x.UserId == 0) // Only required on CREATE
                .MinimumLength(6).WithMessage("Password must be at least 6 characters.");

            RuleFor(x => x.City).MaximumLength(50);
            RuleFor(x => x.Bio).MaximumLength(500);
        }
    }
}
