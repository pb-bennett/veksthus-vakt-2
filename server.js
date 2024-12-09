if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app");
const db = require("./models");

const port = process.env.PORT || "3000";

// if (process.env.NODE_ENV === "development")

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating database tables:", error);
  });

app.listen(port, () => {
  console.log(`Listening on ${port}`);
  db.sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
});
