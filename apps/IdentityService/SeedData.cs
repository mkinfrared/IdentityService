﻿// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using System;
using System.Linq;
using System.Security.Claims;

using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.EntityFramework.Storage;

using IdentityService.Entities;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using Serilog;

namespace IdentityService;

public class SeedData
{
  public static void EnsureSeedData(string connectionString)
  {
    var services = new ServiceCollection();

    services.AddOperationalDbContext(
      options =>
      {
        options.ConfigureDbContext = db =>
          db.UseNpgsql(
            connectionString,
            sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName)
          );
      }
    );

    services.AddConfigurationDbContext(
      options =>
      {
        options.ConfigureDbContext = db =>
          db.UseNpgsql(
            connectionString,
            sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName)
          );
      }
    );

    var serviceProvider = services.BuildServiceProvider();

    using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
    {
      scope.ServiceProvider.GetService<PersistedGrantDbContext>().Database.Migrate();

      var context = scope.ServiceProvider.GetService<ConfigurationDbContext>();
      context.Database.Migrate();
      EnsureSeedData(context);
    }
  }

  private static void EnsureSeedData(ConfigurationDbContext context)
  {
    if (!context.Clients.Any())
    {
      Log.Debug("Clients being populated");

      foreach (var client in Config.Clients.ToList())
      {
        context.Clients.Add(client.ToEntity());
      }

      context.SaveChanges();
    }
    else
    {
      Log.Debug("Clients already populated");
    }

    if (!context.IdentityResources.Any())
    {
      Log.Debug("IdentityResources being populated");

      foreach (var resource in Config.IdentityResources.ToList())
      {
        context.IdentityResources.Add(resource.ToEntity());
      }

      context.SaveChanges();
    }
    else
    {
      Log.Debug("IdentityResources already populated");
    }

    if (!context.ApiScopes.Any())
    {
      Log.Debug("ApiScopes being populated");

      foreach (var resource in Config.ApiScopes.ToList())
      {
        context.ApiScopes.Add(resource.ToEntity());
      }

      context.SaveChanges();
    }
    else
    {
      Log.Debug("ApiScopes already populated");
    }

    if (!context.ApiResources.Any())
    {
      Log.Debug("ApiResources being populated");

      foreach (var resource in Config.Resources.ToList())
      {
        context.ApiResources.Add(resource.ToEntity());
      }

      context.SaveChanges();
    }
    else
    {
      Log.Debug("ApiResources already populated");
    }
  }

  public static void SeedUsers(IServiceProvider serviceProvider)
  {
    var userManager = serviceProvider.GetService<UserManager<User>>();

    var user = new User {UserName = "admin", DateOfBirth = new DateOnly(1988, 9, 18)};

    var result = userManager.CreateAsync(user, "Pass123#").GetAwaiter().GetResult();

    if (result.Succeeded)
    {
      var claim = new Claim(ClaimTypes.Role, "admin");
      userManager.AddClaimAsync(user, claim).GetAwaiter().GetResult();
    }
  }
}
