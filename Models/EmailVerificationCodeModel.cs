﻿using System.ComponentModel.DataAnnotations;
using Entities;

namespace UP.ModelsEF;

public class EmailVerificationCodeModel : BaseModel
{
    [Key] public Guid Id { get; set; }

    [Required] public string Code { get; set; }

    [Required] public string? Email { get; set; }

    [Required] public bool IsApproved { get; set; } = false;
    
    [Required] public Guid UserId { get; set; }
}