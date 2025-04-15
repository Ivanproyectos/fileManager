﻿using AutoMapper;
using FileManagement.Core.Contracts.Request;
using FileManagement.Core.Contracts.Response;
using FileManagement.Core.Entities;
using FileManagement.Core.Enums;
using FileManagement.Core.Exceptions;
using FileManagement.Core.Interfaces.Repositories;
using Google.Apis.Drive.v3.Data;
using MediatR;

namespace FileManagement.Service.UseCases
{
    public class CreateFolderUseCase : IRequestHandler<CreateFolderRequest, CreateFolderResponse>
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUserFolderRepository _userFolderRepository;
        private readonly IFolderPermissionRepository _folderPermissionRepository;
        private readonly IFolderProcessHistoryRepository _folderProcessHistoryRepository;

        public CreateFolderUseCase(
            IFolderRepository folderRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IUserFolderRepository userFolderRepository,
            IUserRepository userRepository,
            IFolderPermissionRepository folderPermissionRepository,
            IFolderProcessHistoryRepository folderProcessHistoryRepository
        )
        {
            _folderRepository = folderRepository;
            _userFolderRepository = userFolderRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _folderPermissionRepository = folderPermissionRepository;
            _folderProcessHistoryRepository = folderProcessHistoryRepository;
        }

        public async Task<CreateFolderResponse> Handle(
            CreateFolderRequest request,
            CancellationToken cancellationToken
        )
        {
            var folder = new Folder
            {
                Name = request.Name,
                Description = request.Description,
                ParentFolderId = request.ParentId == 0 ? null : request.ParentId,
                HasProcessState = request.HasProcessState,
            };

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var newFolder = await _folderRepository.CreateFolderAsync(folder);
                await _unitOfWork.SaveChangesAsync();

                if (request.AsignedFolder)
                {
                    if (!request.FolderPermissions.Any())
                    {
                        throw new ValidationException("No se asignaron usuarios a la carpeta");
                    }

                    var userFolders = request
                        .FolderPermissions.Select(permission => new UserFolder
                        {
                            FolderId = newFolder.Id,
                            UserId = permission.UserId,
                        })
                        .ToList();

                    var folderPermissionsDto = request.FolderPermissions.Select(permission =>
                    {
                        permission.FolderId = newFolder.Id;
                        return permission;
                    });

                    var folderPermissions = _mapper.Map<List<FolderPermission>>(
                        folderPermissionsDto
                    );

                    await _userFolderRepository.AddRangeUsersFolder(userFolders);
                    await _folderPermissionRepository.AddFolderPermissionRangeAsync(
                        folderPermissions
                    );
                }

                if (request.HasProcessState)
                {
                    var folderProcessHistory = new FolderProcessHistory
                    {
                        FolderId = newFolder.Id,
                        IsActive = true,
                        FolderProcessStateId = (int)FolderProcessStateEnum.Pending,
                    };
                    await _folderProcessHistoryRepository.CreateAsync(folderProcessHistory);
                }

                await _unitOfWork.CommitAsync();

                return _mapper.Map<CreateFolderResponse>(newFolder);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }
}
