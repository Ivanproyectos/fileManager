﻿using FileManagement.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FileManagement.Persistence.Configurations
{
    internal class FolderConfiguration : IEntityTypeConfiguration<Folder>
    {
        public void Configure(EntityTypeBuilder<Folder> builder)
        {
            builder.ToTable("Folders");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.ParentFolderId)
                .IsRequired(false);

            builder.HasOne(f => f.ParentFolder) // Un folder tiene un padre
            .WithMany() // Un folder puede tener muchos hijos
            .HasForeignKey(f => f.ParentFolderId) // FK recursiva
            .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Status)
               .HasColumnType("BIT") 
               .HasConversion<bool>().IsRequired()
               .HasDefaultValue(true)
               .HasMaxLength(500)
               .IsRequired();

            builder.Property(x => x.Name)
                .HasMaxLength(500)
                .IsRequired();


            builder.Property(x => x.CreatedBy)
             .IsRequired();

            builder.Property(x => x.CreatedAt)
               .IsRequired();

            builder.Property(x => x.UpdatedAt)
                .IsRequired(false);

            builder.Property(x => x.UpdatedBy)
               .IsRequired(false);

            builder.HasQueryFilter(x => x.DeletedAt == null);
        }
    }
}
