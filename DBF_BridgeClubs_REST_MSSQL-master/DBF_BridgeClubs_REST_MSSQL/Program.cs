using DBF_BridgeClubs_Lib.Interfaces;
using DBF_BridgeClubs_Lib.Repositories;
using DBF_BridgeClubs_REST_MSSQL.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ClubMemberRepository>();
builder.Services.AddScoped<ClubPartnerRepository>();

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

app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
	context.Response.StatusCode = StatusCodes.Status500InternalServerError;
	await context.Response.WriteAsJsonAsync(new { error = "An unexpected server error occurred." });
}));

// Configure the HTTP request pipeline.
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.UseCors("allowGet");

app.MapControllers();

app.Run();
