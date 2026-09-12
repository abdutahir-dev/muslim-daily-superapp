import { Router } from "express";
import { CalendarController } from "../controllers/calendar.controller";

export const calendarRouter = Router();

calendarRouter.get("/hijri-today", CalendarController.getHijriToday);
calendarRouter.get("/events", CalendarController.getEvents);
