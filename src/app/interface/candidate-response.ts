import { Candidate } from "./candidate";

//this is not in use because the backend does not wrap the candidates in a  response object that contains the information below.
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