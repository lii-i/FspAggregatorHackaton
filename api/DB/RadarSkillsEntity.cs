public class RadarSkillsEntity {
    public int Id {get; set;}
    public int? CandidateId {get; set;}
    public string? Subject {get; set;}
    public int? Score {get; set;}
    public int? FullMark {get; set;}


    public CandidatesEntity? Candidate {get; set;}
}