﻿namespace UP.DTO;

public class SendMessageRequest
{
    public Guid UserId { get; set; }
    public string Message { get; set; }
}