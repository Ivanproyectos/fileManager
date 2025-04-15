﻿using FileManagement.Core;
using FileManagement.Persistence;
using FileManagement.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FileManagement.IoC
{
    public static class DependencyContainer
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddPersistenceInfrastructure(configuration);
            services.AddCore();
            services.AddServices(configuration);
            return services;
        
        }
    }
}
