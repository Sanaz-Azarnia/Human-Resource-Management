 using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class PayrollConfiguration : IEntityTypeConfiguration<Payroll>
{
    public void Configure(EntityTypeBuilder<Payroll> builder)
    {
        builder.ToTable("Payrolls");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Year)
            .IsRequired();

        builder.Property(p => p.Month)
            .IsRequired();

        builder.Property(p => p.BaseSalary)
            .HasPrecision(18, 2);

        builder.Property(p => p.Overtime)
            .HasPrecision(18, 2);

        builder.Property(p => p.Bonus)
            .HasPrecision(18, 2);

        builder.Property(p => p.Tax)
            .HasPrecision(18, 2);

        builder.Property(p => p.Insurance)
            .HasPrecision(18, 2);

        builder.Property(p => p.GrossSalary)
            .HasPrecision(18, 2);

        builder.Property(p => p.TotalDeductions)
            .HasPrecision(18, 2);

        builder.Property(p => p.NetSalary)
            .HasPrecision(18, 2);

         
        builder.HasOne(p => p.Employee)
            .WithMany(e => e.Payrolls)
            .HasForeignKey(p => p.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}