const helper = require('../helper.js');
const db = require('../db.js');


const patientsRoutes = (app, request) => {
    // Get the patients list
    app.get("/patients", function (req, res) {
        console.log("PATIENTSROUTE: Serving patients Page to " + req.hostname);
        // Create empty passenger list
        history_table = [];

        db.lrange("transactions", 0, -1, function (err, reply) {
            reply.forEach(function (reply, i) {
                history_table.push(JSON.parse(reply));
                console.log("Patient in Redis:" + reply);
            });
            res.render("patients.html", { history_table: history_table });
        });

    });

    // Reset the passenger list
    app.get("/reset", function (req, res) {
        db.del("transactions", function (err, reply) {
            console.log("PATIENTSROUTE: Client requested passenger list reset.");
            res.render("patients.html");
        });
    });
}
module.exports = patientsRoutes