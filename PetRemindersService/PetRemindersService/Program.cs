using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Models;
using PetReminders.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services - remove duplicates
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Pet Reminders API",
        Version = "v1"
    });

    // Configure Swagger to use HTTPS
    c.AddServer(new OpenApiServer
    {
        Url = "https://localhost:7255",
        Description = "Development Server"
    });
});

builder.Services.AddDbContext<PetReminderContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7255;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Pet Reminders API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

// Your existing endpoints...
app.MapGet("/", () =>
{
    var env = app.Environment.EnvironmentName;
    return $"Environment: {env}";
});

app.Run();