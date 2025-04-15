﻿using FileManagement.Core.Contracts.Request;
using FluentValidation;

namespace FileManagement.Core.Validators
{
    public class CreateFolderValidator : AbstractValidator<CreateFolderRequest>
    {
        public CreateFolderValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre del folder es obligatorio")
                .MaximumLength(100).WithMessage("El nombre del folder no puede superar los {MaxLength} caracteres");

            RuleFor(x => x.FolderPermissions)
                 .NotNull().WithMessage("Los usuarios son obligatorios.") // Evita que la lista sea null
                 .NotEmpty().WithMessage("Debe haber al menos un usuario asignado.")
                 .When(x => x.AsignedFolder);



            //RuleFor(x => x.SizeBytes)
            //    .GreaterThan(0).WithMessage("El tamaño del archivo debe ser mayor a 0");

            //RuleFor(x => x.Extension)
            //    .NotEmpty().WithMessage("La extensión es obligatoria")
            //    .Must(ext => new[] { ".jpg", ".png", ".pdf" }.Contains(ext))
            //    .WithMessage("Solo se permiten archivos .jpg, .png o .pdf");
        }
    }
}
