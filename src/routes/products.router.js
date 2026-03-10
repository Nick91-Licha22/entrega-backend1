import { Router } from "express";
import { authorization } from "../middlewares/auth.middleware.js";
import { passportCall } from "../utils.js";

const router = Router();

router.post("/", passportCall('jwt'), authorization('admin'), async (req, res) => {});
router.put("/:pid", passportCall('jwt'), authorization('admin'), async (req, res) => {});
router.delete("/:pid", passportCall('jwt'), authorization('admin'), async (req, res) => {});

export default router;