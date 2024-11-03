using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PetReminders.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<PetReminderContext>
{
    public PetReminderContext CreateDbContext(string[] args)
    {
        // Build config
        IConfiguration configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
            .Build();

        // Get connection string
        var optionsBuilder = new DbContextOptionsBuilder<PetReminderContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        optionsBuilder.UseSqlite(connectionString ?? "Data Source=petreminder.db");

        return new PetReminderContext(optionsBuilder.Options);
    }
}