﻿using System.ComponentModel.DataAnnotations;
using Entities;

namespace UP.ModelsEF;

public class Withdrawal : BaseModel
{
    [Key] public Guid Id { get; set; }

    [Required] public double Quantity { get; set; }

    [Required] public double Commission { get; set; }

    [Required] public Guid UserId { get; set; }

    public virtual User User { get; set; }
}