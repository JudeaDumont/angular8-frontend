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


    //todo: make another post mapping that takes multiple candidates
    //todo: make a delete mapping that takes multiple candidates
    //todo: make use of post and delete mappings client side where 
    // user enters proper json into a text area 
    // that contains list of candidates to save and delete.