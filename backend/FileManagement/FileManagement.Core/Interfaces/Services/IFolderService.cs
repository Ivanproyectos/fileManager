﻿using FileManagement.Core.Contracts.Dtos;
using FileManagement.Core.Contracts.Request;
using FileManagement.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManagement.Core.Interfaces.Services
{
    public interface IFolderService
    {
        public Task<GetFolderByIdRequest> GetFolderByIdAsync(int folderId);
        public Task<List<FolderDto>> GetAllFoldersAsync();
        public Task<List<SubFolderDto>> GetSubFoldersAsync(int folderId);
        public Task<List<FileDto>> GetFolderFiles(int folderId);
        public Task DeleteFolderAndFiles(int folderId);
        public Task UpdateStatus(int folderId);
        public Task ChangeProcessStatus(int folderId, int statusId);
    }
}
