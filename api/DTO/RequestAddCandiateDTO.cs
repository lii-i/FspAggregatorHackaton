using System.Text.Json.Serialization;


// потом добавить поля что в базе (например аватарку, ссылку на гит и т.д.)
public class RequestAddCandiateDTO{
    [JsonPropertyName("fullName")]
    public string? FullName { get; set; }

    [JsonPropertyName("handle")]
    public string? Handle { get; set; }
    
    [JsonPropertyName("city")]
    public string? City { get; set; }
    
    [JsonPropertyName("grade")]
    public string? Grade { get; set; }
    
    [JsonPropertyName("categorySpecialization")]
    public string[]? CategorySpecialization { get; set; }
    
    [JsonPropertyName("salaryMax")]
    public int? SalaryMax { get; set; }
    
    [JsonPropertyName("salaryMin")]
    public int? SalaryMin { get; set; }
    
    [JsonPropertyName("primaryStack")]
    public string[]? PrimaryStack { get; set; }
    
    [JsonPropertyName("bio")]
    public string? Bio { get; set; }
    
    [JsonPropertyName("isOpenToOffers")]
    public bool? IsOpenToOffers { get; set; }
    
    [JsonPropertyName("testIsPassed")]
    public bool? TestIsPassed { get; set; }
    
    [JsonPropertyName("testedGrade")]
    public string? TestedGrade { get; set; }
    
    [JsonPropertyName("testPassedAt")]
    public DateTime? TestPassedAt { get; set; }
    
    [JsonPropertyName("testCoolDownUntil")]
    public DateTime? TestCoolDownUntil { get; set; }
    
    [JsonPropertyName("telegram")]
    public string? Telegram { get; set; }
    
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    
    [JsonPropertyName("phone")]
    public string? Phone { get; set; }
    
    [JsonPropertyName("fspId")]
    public string? FspId { get; set; }
    
    [JsonPropertyName("fspSportRang")]
    public string? FspSportRang { get; set; }
    
    [JsonPropertyName("fspRatingScore")]
    public int? FspRatingScore { get; set; }
}