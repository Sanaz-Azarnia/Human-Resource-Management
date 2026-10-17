 using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder.ToTable("LeaveRequests");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(l => l.Reason)
            .IsRequired();

        builder.Property(l => l.StartDate)
            .IsRequired();

        builder.Property(l => l.EndDate)
            .IsRequired();

        builder.Property(l => l.Type)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(l => l.Status)
            .IsRequired()
            .HasMaxLength(20)
            .HasDefaultValue("Pending");

         
        builder.HasOne(l => l.Employee)
            .WithMany(e => e.LeaveRequests)
            .HasForeignKey(l => l.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}