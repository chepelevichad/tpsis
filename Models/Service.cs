﻿using System.ComponentModel.DataAnnotations;
using Entities;

namespace UP.Models;

public class Service : BaseModel
{
    [Key] public Guid Id { get; set; }
    
    [Required] public string Name { get; set; }
    
    [Required] public string About { get; set; }
    
    [Required] public string PhotoName { get; set; }
}