using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using SkillSwape.DTOs;
using SkillSwape.Services;
using SkillSwape.Validators;

var builder = WebApplication.CreateBuilder(args);

// ------------------ SERVICES ------------------

// DB
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Controllers + FluentValidation (manual only)
builder.Services
    .AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.AutomaticValidationEnabled = false;
        fv.DisableDataAnnotationsValidation = true;
    });

// Validators (manual)
// Scans the assembly and registers ALL validators
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ------------------ APP ------------------

var app = builder.Build();

// Development middlewares
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global middlewares
app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthorization();

app.MapControllers();

app.Run();
