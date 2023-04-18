using System;
using System.Reflection;

using IdentityServer4.Services;

using IdentityService.Entities;

using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IdentityService.Services;

public class IdentityServerService : ISerivce
{
    public void InstallServices(
        IServiceCollection service,
        IConfiguration configuration,
        IWebHostEnvironment env
    )
    {
        var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
        var connectionString = configuration.GetConnectionString("Postgres");

        var builder = service
            .AddIdentityServer(
                options =>
                {
                    options.Authentication.CookieLifetime = TimeSpan.FromDays(30);
                    options.Authentication.CookieSlidingExpiration = true;
                    options.UserInteraction.LogoutUrl = "/Auth/Logout";
                }
            )
            .AddConfigurationStore(
                options =>
                {
                    options.ConfigureDbContext = builder =>
                        builder.UseNpgsql(
                            connectionString,
                            optionsBuilder => optionsBuilder.MigrationsAssembly(migrationsAssembly)
                        );
                }
            )
            .AddOperationalStore(
                options =>
                {
                    options.ConfigureDbContext = builder =>
                        builder.UseNpgsql(
                            connectionString,
                            optionsBuilder => optionsBuilder.MigrationsAssembly(migrationsAssembly)
                        );

                    // this enables automatic token cleanup. this is optional.
                    options.EnableTokenCleanup = true;
                    options.TokenCleanupInterval = 3600; // interval in seconds (default is 3600)
                }
            )
            .AddProfileService<AppProfileService>()
            .AddAspNetIdentity<User>();

        builder.AddDeveloperSigningCredential();

        service.AddTransient<IProfileService, AppProfileService>();
    }
}
