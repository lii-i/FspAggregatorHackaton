public class CompanyEntity {
    public int Id {get; set;}
    public string? LogoUrl {get; set;}
    public string? Name {get; set;}
    public string? Industry {get; set;}
    public string? Description {get; set;}
    public string? WebSite {get; set;}
    public string? Country {get; set;}
    public string? City {get; set;}
    public string? Street {get; set;}
    public bool? IsVerified {get; set;}

    public List<JobOffersEntity> JobOffers {get; set;}= new List<JobOffersEntity>();
}