using Microsoft.EntityFrameworkCore;
using Streak.API.Features.Auth;
using Streak.Application;
using Streak.Infrastructure;
using Streak.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddProblemDetails();

// shortcut: origin FE ghi cứng cho dev (cổng 3000 khớp vite.config.ts), đưa vào cấu hình khi có domain thật.
builder.Services.AddCors(options => options.AddPolicy("Fe", policy =>
    policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();

app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }
}

app.UseHttpsRedirection();

app.UseCors("Fe");

app.MapAuthApi();

app.Run();
