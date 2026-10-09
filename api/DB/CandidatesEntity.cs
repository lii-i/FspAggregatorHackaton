public class CandidatesEntity {
    public int Id {get; set;} 
    public string? FullName {get; set;}
    public string? AvatarURL {get; set;}
    public string? Handle {get; set;}
    public string? Headline {get; set;}
    public string? City {get; set;}
    public string? Grade {get; set;}
    public string? CategorySpecialization {get; set;}
    public int? SalaryMax {get; set;}
    public int? SalaryMin {get; set;}
    public string[]? PrimaryStack {get; set;}
    public string? Bio {get; set;}
    public bool? IsOpenToOffers {get; set;}
    public bool? TestIsPassed {get; set;}
    public string? TestedGrade {get; set;}
    public DateTime? TestPassedAt {get; set;}
    public DateTime? TestCoolDownUntil {get; set;}
    public int? AwerageTestScore {get; set;}
    public string? Telegram {get; set;}
    public string? Email {get; set;}
    public string? Phone {get; set;}
    public string? GitHub {get; set;}
    public string? FspId {get; set;}
    public string? FspSportRang {get; set;}
    public int? FspRatingScore {get; set;}
    public int? ContestsParticipated { get; set; }
    public int? PodiumsCount { get; set; }

    public List<FspAchivementsEntity> FspAchivements {get; set;} = new List<FspAchivementsEntity>();
    public List<RadarSkillsEntity> RadarSkills {get; set;} = new List<RadarSkillsEntity>();
    public List<JobOffersEntity> JobOffers {get; set;} = new List<JobOffersEntity>();

}