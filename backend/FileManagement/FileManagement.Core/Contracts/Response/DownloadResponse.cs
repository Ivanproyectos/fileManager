﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManagement.Core.Contracts.Response
{
    public record struct DownloadResponse(
        Stream File,
        string MimeType,
        string FileName
    );
}
