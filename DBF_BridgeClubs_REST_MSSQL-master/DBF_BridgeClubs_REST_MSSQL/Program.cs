using DBF_BridgeClubs_Lib.Interfaces;
using DBF_BridgeClubs_Lib.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
	options.AddPolicy("allowGet",
		builder =>
			builder.AllowAnyOrigin()
			.WithMethods("GET")
			.AllowAnyHeader());
	options.AddPolicy("allowAnything", // similar to * in Azure
		builder =>
			builder.AllowAnyOrigin()
				.AllowAnyMethod()
				.AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.UseCors("allowGet");

app.MapControllers();

app.Run();
