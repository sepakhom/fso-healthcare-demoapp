const helper = require('../helper.js');

const name ="BOOKINGROUTES"
const bookingRoutes = (app, request) => {
   
    // Predictor Service
    var predictorHost = process.env.PREDICTOR_SERVICE
    var predictorPort = process.env.PREDICTOR_PORT 
    var predictorURL = "http://" + predictorHost + ":" + predictorPort + "/booking";
    console.log("predictorURL:" + predictorURL)

    // Calendar Service
    var calendarHost = process.env.CALENDAR_SERVICE 
    var calendarPort = process.env.CALENDAR_PORT 
    var calendarUrl = "http://" + calendarHost + ":" + calendarPort + "/getAvailability";

    // Confirm booking
    app.post("/confirmBooking", function (req, res) {

        
        let availability = [];
        try {

            // Build Predictor POST options
            var options = {
                method: "get",
                json: true,
                url: calendarUrl
            };

            // Execute POST to CalendarService
            request(options, function (err, response, body) {
                if (err) {
                    helper.log(name, "confirmBooking ERROR calling the CalendarService :" + err);
                    res.render("ordersummary.html", { service_unavailable: true });
                    return;
                }
                availDays = response.body;
                for (let i = 0; i < availDays.length; i++) {
                    helper.log(name, "Date" + response.body[0])
                    availability.push(new Date(response.body[i]))
                }

                res.render("confirmBooking.html", {
                    doctor: req.body.doctor,
                    category: req.body.category,
                    specialty: req.body.specialty,
                    price: req.body.price,
                    hospital: req.body.hospital,
                    date: availability, // change availability to fetch data from Calendar Service
                    validation_success: true
                });

            });
        } catch (err) {
            helper.log(name, err);
        }
    });




    // Confirm booking
    app.post("/book", function (req, res) {

        try {
            // Build Payload
            payload = helper.payloadBuilder(req.body)
            // Build Predictor POST options
            var options = {
                method: "post",
                body: payload,
                json: true,
                url: helper.predictorURL
            };
            console.log("\n\n\n\d" + app.predictorURL);
            // Execute POST to Predictor
            request(options, function (err, response, body) {
                if (err) {
                    console.log("confirmBooking ERROR :", err);
                    res.render("ordersummary.html", { service_unavailable: true });
                    return;
                }


                helper.addAppDynamicsData(payload)
                console.log('APPD: Stats sent.')

                res.render("ordersummary.html", {
                    result: payload,
                    validation_success: true
                });


            });
        } catch (err) {
            console.log(err);
        }
    });





}
module.exports = bookingRoutes