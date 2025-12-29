using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SkillSwape.Models
{
    public class CategoryModel
    {
        [Key]
        public int CategoryId { get; set; }

        [Required, MaxLength(100)]
        public string CategoryName { get; set; }
        //  Navigation
        [JsonIgnore]
        public ICollection<ServiceModel> Services { get; set; } = new List<ServiceModel>();
    }
}
