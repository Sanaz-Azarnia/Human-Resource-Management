using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AttendanceSheetConfiguration : IEntityTypeConfiguration<AttendanceSheet>
{
    public void Configure(EntityTypeBuilder<AttendanceSheet> builder)
    {
        builder.ToTable("AttendanceSheets");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Title)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Notes)
            .HasMaxLength(500);
            
        builder.Property(s => s.Date)
            .IsRequired();
    }
}