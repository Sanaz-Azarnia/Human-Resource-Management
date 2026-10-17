using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.ToTable("Reports");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.Content)
            .IsRequired();

        builder.Property(r => r.Type)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(r => r.AttachmentUrl)
            .HasMaxLength(500);

         
        builder.HasOne(r => r.Employee)
            .WithMany(e => e.Reports)
            .HasForeignKey(r => r.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}