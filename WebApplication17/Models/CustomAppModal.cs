using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApplication17.Models
{
    public class CustomAppModal
    {
        [Key]
        public int Id { get; set; }

        //[Required]
        //[StringLength(50)]
        public string PackageName { get; set; }

        //[Required]
        //[StringLength(50)]
        public string Url { get; set; }

        //[Required]
        //[StringLength(50)]
        public string Architecture { get; set; }

        //[Required]
        //[StringLength(50)]
        public string InstallCommandLine { get; set; }

        //[Required]
        //[StringLength(50)]
        public string UninstallCommandLine { get; set; }

        //[Required]
        //[StringLength(50)]
        public string Restart { get; set; }

        //[Required]
        public int InstallTimeOut { get; set; }

        //[Required]
        //[StringLength(50)]
        public string RunAs { get; set; }
    }
}
