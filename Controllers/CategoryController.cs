using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs;
using SkillSwape.Models;
using SkillSwape.Services;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IValidator<CategoryDto> _validator;

    public CategoriesController(ApplicationDbContext context, IValidator<CategoryDto> validator)
    {
        _context = context;
        _validator = validator;
    }

    // ================= GET ALL =================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    // ================= GET BY ID =================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound("Category not found");

        return Ok(category);
    }

    // ================= CREATE =================
    [HttpPost]
    public async Task<IActionResult> Create(CategoryDto dto)
    {
        var result = await _validator.ValidateAsync(dto);
        if (!result.IsValid)
            return BadRequest(result.Errors);

        var category = new CategoryModel
        {
            CategoryName = dto.CategoryName
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    // ================= UPDATE =================
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CategoryDto dto)
    {
        var result = await _validator.ValidateAsync(dto);
        if (!result.IsValid)
            return BadRequest(result.Errors);

        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound("Category not found");

        category.CategoryName = dto.CategoryName;
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    // ================= DELETE =================
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound("Category not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok("Category deleted successfully");
    }
}
