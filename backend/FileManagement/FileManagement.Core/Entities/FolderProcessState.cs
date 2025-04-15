﻿using FileManagement.Core.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FileManagement.Core.Entities
{
    public sealed class FolderProcessState: AuditableBaseEntity
    { 
        public string Name { get; set; }
        public string Description { get; set; }

    }
}
