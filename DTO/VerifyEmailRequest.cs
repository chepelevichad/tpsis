﻿namespace TestApplication.DTO;

public class VerifyEmailRequest
{
    public Guid Id { get; set; }
   
    public string Code { get; set; }
}