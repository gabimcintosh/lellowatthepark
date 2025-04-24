import { ProgramT } from "./types";
import { encode, decode } from "@msgpack/msgpack";

export const loadPrograms = async (): Promise<ProgramT[]> => {
    const localStoragePrograms = window.localStorage.getItem('programs');
    if (localStoragePrograms) {
        return decryptProgramData(localStoragePrograms);
    }
    const programsRsp = await fetch('./programs.txt');
    const programsTxt = await programsRsp.text();
    return decryptProgramData(programsTxt);
}

export const savePrograms = async (programs: ProgramT[]): Promise<void> => {
    const programsJson = JSON.stringify(programs);
    const base64Str = btoa(programsJson);
    const buffer = encode(base64Str);
    let str = '';
    buffer.forEach((byte) => {
        str += `${byte} `
    });
    str = str.trim();
    window.localStorage.setItem('programs', str);
}

const decryptProgramData = (programsTxt: string): ProgramT[] => {
    const arr = programsTxt.split(' ').map(char => Number.parseInt(char));
    const uInt8Array = Uint8Array.from(arr);
    const base64Str = decode(uInt8Array) as string;
    const programsJson = atob(base64Str);

    return JSON.parse(programsJson);
}
