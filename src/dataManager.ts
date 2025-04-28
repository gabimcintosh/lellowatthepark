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
};

const encryptProgramData = (programs: ProgramT[]) => {

};

export const savePrograms = async (programs: ProgramT[]): Promise<void> => {
    const programData = encryptProgramData(programs);
    window.localStorage.setItem('programs', programData);
};

const decryptProgramData = (programsTxt: string): ProgramT[] => {
    console.group('decrypt');
    console.log('programsTxt', programsTxt);
    const arr = programsTxt.split(' ').map(char => Number.parseInt(char));
    console.log('arr', arr);
    const uInt8Array = Uint8Array.from(arr);
    console.log('uInt8Array', uInt8Array);
    const base64Buff = decode(uInt8Array) as Uint8Array;
    console.log('base64Buff', base64Buff);
    const base64Str = String.fromCharCode(...base64Buff);
    console.log('base64Str', base64Str);
    const programs = JSON.parse(base64Str);
    console.log('programs', programs);
    console.groupEnd()

    return programs;
};
