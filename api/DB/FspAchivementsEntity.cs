public class FspAchivementsEntity {
    public int Id {get; set;}
    public int? CandidateId {get; set;}
    public string? TournamentName {get; set;}
    public string? Stage {get; set;}
    public int? Year { get; set; }
    public string? Discipline {get; set;}
    public string? PlaceResult { get; set; }
    public string? TeamName {get; set;}
    public string? RoleInTeam {get; set;}
    public string? VerificationHash {get; set;}
    public DateTime? VerifiedDate {get; set;}

    public CandidatesEntity? Candidate {get; set;}
}