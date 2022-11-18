import { Candidate } from "./candidate";

export interface CandidateResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: {
        candidates?: Candidate[],
        candidate?: Candidate,
    }
}