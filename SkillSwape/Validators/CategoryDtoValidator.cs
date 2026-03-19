using FluentValidation;
using SkillSwape.DTOs;

namespace SkillSwape.Validators
{
    public class CategoryValidator : AbstractValidator<CategoryDto>
    {
        public CategoryValidator()
        {
            RuleFor(x => x.CategoryName)
                .NotEmpty().WithMessage("Category Name is required.")
                .MaximumLength(100).WithMessage("Category Name cannot exceed 100 characters.");

            RuleFor(x => x.CategoryId)
                .GreaterThanOrEqualTo(0).WithMessage("CategoryId cannot be negative.");
        }
    }
}
