import { ProgramT } from "./types";
import { decode } from "@msgpack/msgpack";

export const loadPrograms = async (): Promise<ProgramT[]> => {
    const programsRsp = await fetch('./programs.txt');
    const programsTxt = await programsRsp.text();
    return decryptProgramData(programsTxt);
}

const decryptProgramData = (programsTxt: string): ProgramT[] => {
    const arr = programsTxt.split(' ').map(char => Number.parseInt(char));
    const uInt8Array = Uint8Array.from(arr);
    const base64Str = decode(uInt8Array) as string;
    const programsJson = atob(base64Str);
    console.log(programsJson)
    
    return JSON.parse(programsJson);
}
