import express, { response } from "express";
import moment from "moment";
import axios from "axios";
import { TimeTable } from "./timetable";
import { Reservation } from "./reservation";

const app = express();
const port = 1234;

const serviceRoot = "http://127.0.0.1:8080";

app.get("/rooms", (req, res) => {
    var date : any = req.query.date;
    var resourceId : any = req.query.resourceId;

    if (!moment(date, moment.ISO_8601, true).isValid()) {
        res.status(400).json({ "error": "wrong format for param startDatetime" });
        return;
    }
    if (resourceId != 1337) {
        res.status(404).json({ "error": "resource not found" });
        return;
    }
    
    axios.get(`${serviceRoot}/timetables?date=${date}&resourceId=${resourceId}`)
        .then(response  => {
            const timetables: TimeTable[] = response.data.timetables;

            const isInsideTimeTable = timetables.map(e => {
                return moment(date).isBetween(e.opening, e.closing, undefined, "[)");
            }).filter(e => e).length > 0;

            if (!isInsideTimeTable) {
                res.status(200).json({ "available": false });
                return;
            }

            return axios.get(`${serviceRoot}/reservations?date=${date}&resourceId=${resourceId}`);
        })
        .then(response => {
            if (!response) {
                return;
            } 

            const reservations: Reservation[] = response.data.reservations;

            const isInsideReservations = reservations.map(e => {
                return moment(date).isBetween(e.reservationStart, e.reservationEnd, undefined, "[)");
            }).filter(e => e).length > 0;

            res.status(200).json({ "available": !isInsideReservations });
            return;
        })
        .catch(err => {
            console.error(err);
            res.status(404).json(err);
        });
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});