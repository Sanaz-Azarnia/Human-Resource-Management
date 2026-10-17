 using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.ToTable("Employees");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Firstname)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(e => e.Lastname)
            .HasMaxLength(50);

        builder.Property(e => e.PersonnelId)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.NationalId)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(e => e.Email)
            .IsRequired()
            .HasMaxLength(254);

        builder.Property(e => e.Phone)
            .IsRequired()
            .HasMaxLength(11);

        builder.Property(e => e.PasswordHash)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(e => e.Address)
            .HasMaxLength(500);

        builder.Property(e => e.AvatarUrl)
            .HasMaxLength(500);

        builder.Property(e => e.BaseSalary)
            .HasPrecision(18, 2);

         
        builder.HasIndex(e => e.PersonnelId)
            .IsUnique();

        builder.HasIndex(e => e.NationalId)
            .IsUnique();

        builder.HasIndex(e => e.Email)
            .IsUnique();

        builder.HasIndex(e => e.Phone)
            .IsUnique();

        
        builder.HasOne(e => e.Role)
            .WithMany(r => r.Employees)
            .HasForeignKey(e => e.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}