/**
 * AttendX — API Router
 * Mounts all feature routers under /api
 */
import { Router } from "express";
import authRouter           from "./auth";
import usersRouter          from "./users";
import attendanceRouter     from "./attendance";
import leaveRouter          from "./leave";
import payrollRouter        from "./payroll";
import aiRouter             from "./ai";
import pushRouter           from "./push";
import workReportsRouter    from "./work-reports";
import messagesRouter       from "./messages";
import bonusesRouter        from "./bonuses";
import departmentsRouter    from "./departments";
import locationsRouter      from "./locations";
import requestsRouter       from "./requests";
import salaryAdvancesRouter from "./salary-advances";
import settingsRouter       from "./settings";
import notificationsRouter  from "./notifications";
import reportsRouter        from "./reports";
import adminRouter          from "./admin";

const router = Router();

router.use("/auth",            authRouter);
router.use("/users",           usersRouter);
router.use("/attendance",      attendanceRouter);
router.use("/leave",           leaveRouter);
router.use("/payroll",         payrollRouter);
router.use("/ai",              aiRouter);
router.use("/push",            pushRouter);
router.use("/work-reports",    workReportsRouter);
router.use("/messages",        messagesRouter);
router.use("/bonuses",         bonusesRouter);
router.use("/departments",     departmentsRouter);
router.use("/locations",       locationsRouter);
router.use("/requests",        requestsRouter);
router.use("/salary-advances", salaryAdvancesRouter);
router.use("/settings",        settingsRouter);
router.use("/notifications",   notificationsRouter);
router.use("/reports",         reportsRouter);
router.use("/admin",           adminRouter);

export default router;
