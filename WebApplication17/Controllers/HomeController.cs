using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication17.Models;

namespace WebApplication17.Controllers
{
    public class HomeController : Controller
    {
        List<CustomAppModal> scriptList = new List<CustomAppModal>();
        string CustomScript = ConfigurationManager.ConnectionStrings["CustomScriptConString"].ConnectionString;

        
        public ActionResult Index()
        {
            return View();
        }

        
        [HttpGet]
        public ActionResult CustomeApp()
        {
            return View();
        }

        
        public ActionResult CustomAppData()
        {
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Table]", con);
                cmd.CommandType = CommandType.Text;
                con.Open();

                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    var csmodel = new CustomAppModal();

                    csmodel.Id = Convert.ToInt32(rdr["Id"]);
                    csmodel.PackageName = rdr["PackageName"].ToString();
                    csmodel.Url = rdr["Url"].ToString();
                    csmodel.Architecture = rdr["Architecture"].ToString();
                    csmodel.InstallCommandLine = rdr["InstallCommandLine"].ToString();
                    csmodel.UninstallCommandLine = rdr["UninstallCommandLine"].ToString();
                    csmodel.Restart = rdr["Restart"].ToString();
                    csmodel.InstallTimeOut = Convert.ToInt32(rdr["InstallTimeOut"]);
                    csmodel.RunAs = rdr["RunAs"].ToString();

                    scriptList.Add(csmodel);
                }
            }

            return Json(scriptList, JsonRequestBehavior.AllowGet);
        }

        
        [HttpPost]
        public ActionResult CustomeApp(CustomAppModal newModel)
        {
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                con.Open();

                string sql = @"INSERT INTO [dbo].[Table] 
                       (PackageName, Url, Architecture, InstallCommandLine, 
                        UninstallCommandLine, Restart, InstallTimeOut, RunAs)
                       VALUES
                       (@PackageName, @Url, @Architecture, @InstallCommandLine,
                        @UninstallCommandLine, @Restart, @InstallTimeOut, @RunAs)";

                SqlCommand cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@PackageName", newModel.PackageName);
                cmd.Parameters.AddWithValue("@Url", newModel.Url);
                cmd.Parameters.AddWithValue("@Architecture", newModel.Architecture);
                cmd.Parameters.AddWithValue("@InstallCommandLine", newModel.InstallCommandLine);
                cmd.Parameters.AddWithValue("@UninstallCommandLine", newModel.UninstallCommandLine);
                cmd.Parameters.AddWithValue("@Restart", newModel.Restart);
                cmd.Parameters.AddWithValue("@InstallTimeOut", newModel.InstallTimeOut);
                cmd.Parameters.AddWithValue("@RunAs", newModel.RunAs);

                cmd.ExecuteNonQuery();
            }

            return RedirectToAction("CustomeApp");
        }


        
        [HttpGet]
        public JsonResult Edit(int id)
        {
            var csmodelToEdit = new CustomAppModal();
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                con.Open();
                string sql = @"SELECT * FROM [dbo].[Table] WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.CommandType = CommandType.Text;

                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    csmodelToEdit.Id = Convert.ToInt32(rdr["Id"]);
                    csmodelToEdit.PackageName = rdr["PackageName"].ToString();
                    csmodelToEdit.Url = rdr["Url"].ToString();
                    csmodelToEdit.Architecture = rdr["Architecture"].ToString();
                    csmodelToEdit.InstallCommandLine = rdr["InstallCommandLine"].ToString();
                    csmodelToEdit.UninstallCommandLine = rdr["UninstallCommandLine"].ToString();
                    csmodelToEdit.Restart = rdr["Restart"].ToString();
                    csmodelToEdit.InstallTimeOut = Convert.ToInt32(rdr["InstallTimeOut"]);
                    csmodelToEdit.RunAs = rdr["RunAs"].ToString();
                }
            }

            return csmodelToEdit != null ? Json(csmodelToEdit, JsonRequestBehavior.AllowGet) : Json(new { error = "Not Found" });
        }

        
        [HttpPost]
        public ActionResult Edit(CustomAppModal updatedModel)
        {
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                con.Open();

                string sql = @"UPDATE [dbo].[Table]
                           SET 
                               PackageName = @PackageName,
                               Url = @Url,
                               Architecture = @Architecture,
                               InstallCommandLine = @InstallCommandLine,
                               UninstallCommandLine = @UninstallCommandLine,
                               Restart = @Restart,
                               InstallTimeOut = @InstallTimeOut,
                               RunAs = @RunAs
                           WHERE
                               Id = @Id";

                SqlCommand cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@PackageName", updatedModel.PackageName);
                cmd.Parameters.AddWithValue("@Url", updatedModel.Url);
                cmd.Parameters.AddWithValue("@Architecture", updatedModel.Architecture);
                cmd.Parameters.AddWithValue("@InstallCommandLine", updatedModel.InstallCommandLine);
                cmd.Parameters.AddWithValue("@UninstallCommandLine", updatedModel.UninstallCommandLine);
                cmd.Parameters.AddWithValue("@Restart", updatedModel.Restart);
                cmd.Parameters.AddWithValue("@InstallTimeOut", updatedModel.InstallTimeOut);
                cmd.Parameters.AddWithValue("@RunAs", updatedModel.RunAs);
                cmd.Parameters.AddWithValue("@Id", updatedModel.Id);

                cmd.ExecuteNonQuery();
            }

            return RedirectToAction("CustomeApp");
        }



        [HttpGet, ActionName("Delete")]
        public JsonResult ConfirmAbtDelete(int[] ids)
        {
            // Ensure there are IDs to process
            if (ids != null && ids.Length > 0)
            {
                // Create a list to store results
                List<CustomAppModal> csModels = new List<CustomAppModal>();

                using (SqlConnection con = new SqlConnection(CustomScript))
                {
                    con.Open();

                    // Use SQL IN clause to fetch records for multiple IDs
                    string sql = $"SELECT * FROM [dbo].[Table] WHERE Id IN ({string.Join(",", ids)})";
                    SqlCommand cmd = new SqlCommand(sql, con);
                    cmd.CommandType = CommandType.Text;

                    SqlDataReader rdr = cmd.ExecuteReader();

                    while (rdr.Read())
                    {
                        CustomAppModal csmodelToEdit = new CustomAppModal();
                        csmodelToEdit.Id = Convert.ToInt32(rdr["Id"]);
                        csmodelToEdit.PackageName = rdr["PackageName"].ToString();
                        csmodelToEdit.Url = rdr["Url"].ToString();
                        csmodelToEdit.Architecture = rdr["Architecture"].ToString();
                        csmodelToEdit.InstallCommandLine = rdr["InstallCommandLine"].ToString();
                        csmodelToEdit.UninstallCommandLine = rdr["UninstallCommandLine"].ToString();
                        csmodelToEdit.Restart = rdr["Restart"].ToString();
                        csmodelToEdit.InstallTimeOut = Convert.ToInt32(rdr["InstallTimeOut"]);
                        csmodelToEdit.RunAs = rdr["RunAs"].ToString();

                        csModels.Add(csmodelToEdit);
                    }
                }

                return csModels.Count > 0
                    ? Json(csModels.Select(model => new { PackageName = model.PackageName }).ToList(), JsonRequestBehavior.AllowGet)
                    : Json(new { error = "Not Found" });
            }
            else
            {
                return Json(new { error = "No IDs provided" });
            }
        }




        [HttpPost]
        [ActionName("Delete")]
        public ActionResult ConfirmDelete(int[] ids)
        {
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                con.Open();

                foreach (var id in ids)
                {
                    string sql = @"DELETE FROM [dbo].[Table]
                        WHERE
                            Id = @Id";

                    SqlCommand cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Id", id);

                    cmd.ExecuteNonQuery();

                    scriptList.RemoveAll(c => c.Id == id);
                }
            }

            return Json(new { success = true, message = "Deleted successfully" });
        }



        [HttpGet]
        public JsonResult Copy(int id)
        {
            var csmodelToEdit = new CustomAppModal();
            using (SqlConnection con = new SqlConnection(CustomScript))
            {
                con.Open();
                string sql = @"SELECT * FROM [dbo].[Table] WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.CommandType = CommandType.Text;

                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    csmodelToEdit.Id = Convert.ToInt32(rdr["Id"]);
                    csmodelToEdit.PackageName = rdr["PackageName"].ToString();
                    csmodelToEdit.Url = rdr["Url"].ToString();
                    csmodelToEdit.Architecture = rdr["Architecture"].ToString();
                    csmodelToEdit.InstallCommandLine = rdr["InstallCommandLine"].ToString();
                    csmodelToEdit.UninstallCommandLine = rdr["UninstallCommandLine"].ToString();
                    csmodelToEdit.Restart = rdr["Restart"].ToString();
                    csmodelToEdit.InstallTimeOut = Convert.ToInt32(rdr["InstallTimeOut"]);
                    csmodelToEdit.RunAs = rdr["RunAs"].ToString();
                }
            }

            return csmodelToEdit != null ? Json(csmodelToEdit, JsonRequestBehavior.AllowGet) : Json(new { error = "Not Found" });
        }


    }
}