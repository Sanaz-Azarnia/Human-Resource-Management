using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
{
    public void Configure(EntityTypeBuilder<Attendance> builder)
    {
        builder.ToTable("Attendances");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Date)
            .IsRequired();

        builder.Property(a => a.Notes)
            .HasMaxLength(500);

         
        builder.HasOne(a => a.Employee)
            .WithMany(e => e.Attendances)
            .HasForeignKey(a => a.EmployeeId)
            .OnDelete(DeleteBehavior.Restrict);  
        
         
        builder.HasOne(a => a.Sheet)
            .WithMany(s => s.Attendances)
            .HasForeignKey(a => a.SheetId)
            .OnDelete(DeleteBehavior.Cascade);
            
        
        builder.HasIndex(a => new { a.SheetId, a.EmployeeId }).IsUnique();
    }
}