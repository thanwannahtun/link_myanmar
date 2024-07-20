import { Router } from "express";
import { routeController } from "../controllers/routeController";

const router = Router()
/// get [routes]
router.get("/", routeController.getAllRoutes);

/// create a new [route]
router.post("/",routeController.createRoute );

/// add [midpoints] to a registered route

router.post("/:route_id/midpoints",routeController.addMidpointsToRoute);

// add seats to a route

router.post("/:route_id/seats",routeController.addSeatsToRoute);

// route detail
router.post("/:route_id/:agency_id?orderBy= &limit= ",routeController.getRouteDetail);

///
export default router;
