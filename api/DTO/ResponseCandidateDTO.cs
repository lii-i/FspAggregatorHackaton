public class ResponseCandidateDTO {
    public int Id {get; set;}
    public string FullName {get; set;}
    public string AvatarURL {get; set;}
    public string Handle {get; set;}
    public string Headline {get; set;}
    public string City {get; set;}
    public string Grade {get; set;}
    
    public CategoryDTO? Category {get; set;}
    
    public int SalaryMax {get; set;}
    public int SalaryMin {get; set;}
    public string[] PrimaryStack {get; set;}
    public string Bio {get; set;}
    public bool IsOpenToOffers {get; set;}
    public string MatchExplanation {get; set;}
    
    public TestSummaryDTO? TestSummary {get; set;}
    public ContactsDTO? Contacts {get; set;}
    public FspProfileDTO? FspProfile {get; set;}
    public RadarSkillsEntity[]? RadarSkills {get; set;}
}

public class CategoryDTO {
    public string Specialization {get; set;}
    public string Grade {get; set;}
}

public class ContactsDTO{
    public string Telegram {get; set;}
    public string Email {get; set;}
    public string Phone {get; set;}
    public string Github {get; set;}
}

public class TestSummaryDTO{
    public bool IsPassed {get; set;}
    public string TestedGrade {get; set;}
    public DateTime PassedAt {get; set;}
    public DateTime CooldownUntil {get; set;}
    public int Score {get; set;}
}

public class FspProfileDTO{
    public bool HasHistory { get; set; }
    public bool IsVerified { get; set; }
    public string FspId {get; set;}
    public string SportRank {get; set;}
    public int RatingScore {get; set;}
    public string[] Disciplines { get; set; }
    public int ContestsParticipated { get; set; }
    public int PodiumsCount { get; set; }
    public FspAchivementsEntity[]? Achievements {get; set;}
}