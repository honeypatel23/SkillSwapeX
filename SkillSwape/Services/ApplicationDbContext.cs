using Microsoft.EntityFrameworkCore;
using SkillSwape.Models;

namespace SkillSwape.Services
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Category ↔ Services
            modelBuilder.Entity<ServiceModel>()
                .HasOne(s => s.Category)
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // User ↔ Services
            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.Services)
                .WithOne(s => s.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // User ↔ RequestsMade
            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.RequestsMade)
                .WithOne(r => r.RequestedBy)
                .HasForeignKey(r => r.RequestedById)
                .OnDelete(DeleteBehavior.Restrict);

            // User ↔ RequestsReceived
            modelBuilder.Entity<UserModel>()
                .HasMany(u => u.RequestsReceived)
                .WithOne(r => r.RequestedTo)
                .HasForeignKey(r => r.RequestedToId)
                .OnDelete(DeleteBehavior.Restrict);

            // Service ↔ ServiceRequests
            modelBuilder.Entity<ServiceModel>()
                .HasMany(s => s.ServiceRequests)
                .WithOne(r => r.Service)
                .HasForeignKey(r => r.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        }


        public DbSet<UserModel> Users { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<CreditTransactionModel> CreditTransactions { get; set; }
        public DbSet<ServiceModel> Services { get; set; }
        public DbSet<LearningSessionModel> LearningSessions { get; set; }
        public DbSet<ServiceRequestModel> ServiceRequests { get; set; }
        public DbSet<WorkProgressModel> WorkProgresses { get; set; }
        public DbSet<WorkSubmissionModel> WorkSubmissions { get; set; }
    }
}
