public class CandidateService{
    private readonly Repository _rep;

    public CandidateService(Repository rep) {
        _rep = rep;
    }

    public async Task<ResponseSearchParamsDTO> GetCandidateForParamsAsync(RequestSearchParamsDTO searchParams)
    {
        try{
            List<CandidatesEntity> candidates = await _rep.GetCandidateForParamsAsync(searchParams);
            
            return MapToResponseCandidate(candidates);
        }catch{
            return new ResponseSearchParamsDTO {ErrorCount = 1};
        }
    }

    public async Task<bool> AddCandiateAsync(RequestAddCandiateDTO candiate){
        try{
            await _rep.AddCandiateAsync(candiate);
            return true;
        } catch{
            return false;
        }
    }


    private ResponseSearchParamsDTO MapToResponseCandidate(List<CandidatesEntity> dbCandidates)
{
    var dtos = dbCandidates.Select(c => new ResponseCandidateDTO 
    {
        Id = c.Id, 
        FullName = c.FullName ?? "Неизвестный кандидат",
        AvatarURL = c.AvatarURL, 
        Handle = c.Handle,
        Headline = c.Headline,
        City = c.City,
        Grade = c.Grade,
        
        Category = c.CategorySpecialization != null && c.CategorySpecialization.Length > 0 ? new CategoryDTO {
            Specialization = c.CategorySpecialization.FirstOrDefault() ?? "",
            Grade = c.Grade ?? "Empty"
        } : null,

        SalaryMin = c.SalaryMin ?? 0,
        SalaryMax = c.SalaryMax ?? 0,
        PrimaryStack = c.PrimaryStack ?? Array.Empty<string>(),
        Bio = c.Bio,
        IsOpenToOffers = c.IsOpenToOffers ?? true,
        MatchExplanation = "Кандидат найден по вашим фильтрам", // Можно потом прикрутить логику ИИ

        TestSummary = new TestSummaryDTO {
            IsPassed = c.TestIsPassed ?? false,
            Score = c.AwerageTestScore ?? 0,
            TestedGrade = c.TestedGrade ?? "Нет грейда",
            PassedAt = c.TestPassedAt ?? DateTime.MinValue,
            CooldownUntil = c.TestCoolDownUntil ?? DateTime.MinValue
        },

        Contacts = new ContactsDTO {
            Telegram = c.Telegram,
            Email = c.Email,
            Phone = c.Phone,
            Github = c.GitHub
        },

        FspProfile = new FspProfileDTO {
            HasHistory = !string.IsNullOrEmpty(c.FspId), 
            IsVerified = !string.IsNullOrEmpty(c.FspId),
            FspId = c.FspId,
            SportRank = c.FspSportRang,
            RatingScore = c.FspRatingScore ?? 0,
            ContestsParticipated = c.ContestsParticipated ?? 0,
            PodiumsCount = c.PodiumsCount ?? 0,
            
            Disciplines = c.FspAchivements != null 
                ? c.FspAchivements.Select(a => a.Discipline).Where(d => d != null).Distinct().ToArray() 
                : Array.Empty<string>(),
                
            Achievements = c.FspAchivements?.ToArray()
        },

        RadarSkills = c.RadarSkills?.ToArray()
        
    }).ToList();

    return new ResponseSearchParamsDTO {
        Candidates = dtos,
        ErrorCount = 0
    };
}

}