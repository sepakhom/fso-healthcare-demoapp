const appd = require('appdynamics');
const { json } = require('body-parser');
const Appointment = require('./module/appointment.model.js');
const appointment = require('./module/appointment.model.js');
const name = "[HelperService]"

// Predictor Service
var predictorHost = process.env.PREDICTOR_SERVICE
var predictorPort = process.env.PREDICTOR_PORT 
var predictorURL = "http://" + predictorHost + ":" + predictorPort + "/booking";
console.log("-----------------------Predicor:"+ predictorURL)


function log (serviceName, msg)  {
    console.log( "[" + name + "]:" + msg)
}

function payloadBuilder( payload)  {
    console.log(name + ": Generating payload...")
    //const appointment = new Appointment(payload) //return as JSON Object
    
    json_payload = {
        name: payload.name,
        lastname: payload.lastname,
        age: payload.age,
        gender: payload.gender,
        mobile: payload.mobile,
        date: payload.date,
        creditcard: payload.creditcard,
        doctor: payload.doctor,
        price: payload.price,
        category: payload.category,
        hospital: payload.hospital
    };
    
    console.log(name + ": Payload:" + JSON.stringify(json_payload))
    return json_payload;

}










/**
 * 
 * @param {*} patient 
 */
function addAppDynamicsData (appointment) {
    console.log(name + ": Sending AppDynamics Snapshot data...")

    appd.addSnapshotData("hc_patient_name", appointment.name);
    appd.addSnapshotData("hc_patient_lastname", appointment.lastname);
    appd.addSnapshotData("hc_patient_date", appointment.date);
    appd.addSnapshotData("hc_patient_doctor", appointment.doctor);
    appd.addSnapshotData("hc_patient_price", parseInt(appointment.price, 10));
    appd.addSnapshotData("hc_patient_age", parseInt(appointment.age, 10));
    appd.addSnapshotData("hc_patient_gender", appointment.gender);
    appd.addSnapshotData("hc_patient_creditcard", appointment.creditcard);
    appd.addSnapshotData("hc_patient_category", appointment.category);
    appd.addSnapshotData("hc_patient_hospital", appointment.hospital);

    console.log(name + ": Sending AppDynamics Snapshot data...!:")
    appd.addAnalyticsData("reimburse_passenger_name", appointment.name);
    appd.addAnalyticsData("hc_patient_name", appointment.name);
    appd.addAnalyticsData("hc_patient_lastname", appointment.lastname);
    appd.addAnalyticsData("hc_patient_date", appointment.date);
    appd.addAnalyticsData("hc_patient_doctor", appointment.doctor);
    appd.addAnalyticsData("hc_patient_price", parseInt(appointment.price, 10));
    appd.addAnalyticsData("hc_patient_age", parseInt(appointment.age, 10));
    appd.addAnalyticsData("hc_patient_gender", appointment.gender);
    appd.addAnalyticsData("hc_patient_creditcard", appointment.creditcard);
    appd.addAnalyticsData("hc_patient_category", appointment.category);
    appd.addAnalyticsData("hc_patient_hospital", appointment.hospital);
}




// Export the module functions
module.exports = {
    addAppDynamicsData,
    log,
    payloadBuilder,
    predictorURL
};

