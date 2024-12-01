using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Models;
using PetReminders.Data;
using Microsoft.OpenApi.Models;
using PetReminders.Data.Repositories;
using PetReminders.Core.Interfaces;
using PetReminders.Api.Endpoints.Users;
using PetReminders.Api.Endpoints.Pets;
using System.Text.Json.Serialization;
using PetReminders.Core.Services;
using PetReminders.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:5173") // Your React app's URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
    );
});

// convert enums properly
// Add services to the container
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;

    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// If you're using Swagger, also configure it to handle enums as strings
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.UseInlineDefinitionsForEnums(); // This helps Swagger understand enum values

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

builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IPetRepository, PetRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IReminderEventRepository, ReminderEventRepository>();


builder.Services.AddDbContext<PetReminderContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 7255;
});

var app = builder.Build();
app.UseCors("AllowReactApp"); // I don't think I need this line

if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<PetReminderContext>();
        db.Database.Migrate(); // This line applies pending migrations
    }
}

// map endpoints
app.MapAuthEndpoints();
app.MapUserEndpoints();
app.MapPetEndpoints();
app.MapReminderEventEndpoints();



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