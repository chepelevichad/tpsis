using System.Net;
using System.Net.Mail;
using System.Security.Authentication;
using System.Text.RegularExpressions;
using Analitique.BackEnd.Handlers;
using Microsoft.EntityFrameworkCore;
using ProjectX.Exceptions;
using Repository;
using TestApplication.DTO;
using UP.DTO;
using UP.ModelsEF;
using UP.Services.Interfaces;

namespace UP.Services;

public class EmailService : IEmailService
{
    private readonly IDbRepository _dbRepository;

    public EmailService(IDbRepository dbRepository)
    {
        _dbRepository = dbRepository;
    }
    

    public async Task VerifyEmail(VerifyEmailRequest request)
    {
        if (request.Code == null) throw new EntityNotFoundException("Code can't be null");
        var code = await _dbRepository.Get<EmailVerificationCodeModel>()
            .FirstOrDefaultAsync(x => x.UserId == request.Id);
        if (code == null) throw new EntityNotFoundException("Wrong code");
        if (code.Code != request.Code) throw new AuthenticationException("Wrong code");
        await DeleteEmailCodeAsync(request.Id);
    }

    private async Task DeleteEmailCodeAsync(Guid id)
    {
        var code = await _dbRepository.Get<EmailVerificationCodeModel>().FirstOrDefaultAsync(x => x.UserId == id);
        if (code == null) throw new EntityNotFoundException("Code not found");
        code.IsApproved = true;
        code.DateUpdated = DateTime.UtcNow;
        await _dbRepository.SaveChangesAsync();
    }

    public async Task SendVerificationCode(Guid id)
    {
        var existedCode =
            await _dbRepository.Get<EmailVerificationCodeModel>().FirstOrDefaultAsync(x => x.UserId == id);
        var random = new Random();
        var code = random.Next(1000, 9999).ToString();
        if (existedCode != null)
        {
            existedCode.Code = code;
            existedCode.DateUpdated = DateTime.UtcNow;
            await _dbRepository.SaveChangesAsync();
            await SendVerificationCodeAsync(id, code); // correct
            return;
        }
        var user = await _dbRepository.Get<User>(x => x.Id == id).FirstOrDefaultAsync();
        if (user == null)
            throw new IncorrectDataException("Пользователь не найден");
        
        var entity = new EmailVerificationCodeModel
        {
            Id = Guid.NewGuid(),
            Email = user.Email,
            UserId = user.Id,
            Code = code,
            DateCreated = DateTime.UtcNow,
        };
        var result = await _dbRepository.Add(entity);
        await _dbRepository.SaveChangesAsync();
        await SendVerificationCodeAsync(id, code); // correct
    }

    private async Task SendVerificationCodeAsync(Guid id, string code)
    {
        var user = await _dbRepository.Get<User>(x => x.Id == id).FirstOrDefaultAsync();
        if (user == null)
            throw new IncorrectDataException("Пользователь не найден");

        
    }



    private static bool IsEmailValid(string email)
    {
        if (email.Length > 100) throw new IncorrectDataException("Email isn't valid");
        const string regex = @"^[^@\s]+@[^@\s]+\.(com|net|org|gov)$";
        return Regex.IsMatch(email, regex, RegexOptions.IgnoreCase);
    }
    
    public async Task RestorePassword(RestorePasswordRequest request)
    {
        if (request.NewPassword == null) throw new IncorrectDataException("Password is empty");
        if (request.NewPassword.Length > 30)
            throw new IncorrectDataException("Password has to be shorter than 30 symbols");
        if (request.NewPassword.Length < 4)
            throw new IncorrectDataException("Password has to be longer than 4 symbols");
        var existedCode =
            await _dbRepository.Get<EmailVerificationCodeModel>().FirstOrDefaultAsync(x => x.UserId == request.UserId);
        if(existedCode?.IsApproved == false)
            throw new IncorrectDataException("Email не подтвержден");
        
        var userToUpdate = await _dbRepository.Get<User>()
            .FirstOrDefaultAsync(x => x.Id == request.UserId);
        if (userToUpdate == null)
            throw new EntityNotFoundException("User not found");

        userToUpdate.Password = HashHandler.HashPassword(request.NewPassword, userToUpdate.Salt);
        await _dbRepository.Remove(existedCode);
        await _dbRepository.SaveChangesAsync();
    }
    
    public async Task SendMessageBlock(SendMessageRequest request)
    {
        var user = await _dbRepository.Get<User>(x => x.Id == request.UserId).FirstOrDefaultAsync();
        if (user == null)
            throw new IncorrectDataException("Пользователь не найден");
    
       
    }
    public async Task SendEmailMessageTransactionsAsync(Guid id, string coinName, double quantity, bool isGet, Guid recieverId)
    {
        var user = await _dbRepository.Get<User>(x => x.Id == id).FirstOrDefaultAsync();
        if (user == null)
            throw new IncorrectDataException("Пользователь не найден");
    
       
    }
}