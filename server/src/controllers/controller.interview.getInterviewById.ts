import { Request, Response } from "express";
import { handleError } from "../config/errorMessages";
import { services } from "../config/services";
import { code } from "../config/status-code";
import { Interview } from "../services/Interview";

export const getInterviewByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { interviewId } = req.query as unknown as { interviewId: string };

    if (!interviewId) {
      res.status(code.BadRequest).json({ msg: "Invalid query parameters." });
      return;
    }

    const result = await Interview.getInterviewById(interviewId);

    res.status(code.Success).json({ data: result });
    return;
  } catch (err) {
    const errMsg = handleError(err, services.Interview);
    res.status(code.ServerError).json({ msg: errMsg });
    return;
  }
};
