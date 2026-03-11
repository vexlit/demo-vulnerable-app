import javax.servlet.http.*;
import java.sql.*;

public class UserService extends HttpServlet {

    // VULNERABLE: SQL Injection in Java
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws java.io.IOException {

        String userId = request.getParameter("id");

        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/app");
            Statement stmt = conn.createStatement();

            // CWE-89: User input directly concatenated into SQL query
            ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = " + userId);

            while (rs.next()) {
                response.getWriter().println(rs.getString("name"));
            }

            conn.close();
        } catch (SQLException e) {
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
}
