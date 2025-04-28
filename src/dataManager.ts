import { ProgramT } from "./types";
import { encode, decode } from "@msgpack/msgpack";

const PROGRAM_DATA_KEY = 'programs';

/**
 * Load the programs from local storage or from a HTTP request
 * 
 * @returns {Promise<ProgramT[]>} A promise that resolves to an array of programs.
 */
export const loadPrograms = async (): Promise<ProgramT[]> => {
    const localStoragePrograms = window.localStorage.getItem(PROGRAM_DATA_KEY);
    if (localStoragePrograms) {
        return decryptProgramData(localStoragePrograms);
    }
    const programsRsp = await fetch('./programs.txt');
    const programsTxt = await programsRsp.text();

    return decryptProgramData(programsTxt);
};

/**
 * Encrypts an array of programs into a string format suitable for storage.
 * 
 * @param programs The programs to be encrypted
 * @returns The encrypted string representation of the programs.
 */
const encryptProgramData = (programs: ProgramT[]): string => {
    const base64Str = JSON.stringify(programs);
    const base64Buff = Uint8Array.from(base64Str.split('').map(char => char.charCodeAt(0)));
    const encodedArray = encode(base64Buff) as Uint8Array;
    const encryptedData = Array.from(encodedArray).map(byte => byte.toString()).join(' ');

    return encryptedData;
};

/**
 * Saves the given array of programs to local storage after encrypting them.
 * 
 * @param programs The programs to be saved
 */
export const savePrograms = async (programs: ProgramT[]): Promise<void> => {
    const programData = encryptProgramData(programs);
    window.localStorage.setItem(PROGRAM_DATA_KEY, programData);
};

/**
 * Decrypts a string representation of programs into an array of programs.
 * 
 * @param programsTxt The encrypted string representation of the programs
 * @returns The decrypted array of programs.
 */
const decryptProgramData = (programsTxt: string): ProgramT[] => {
    const arr = programsTxt.split(' ').map(char => Number.parseInt(char));
    const uInt8Array = Uint8Array.from(arr);
    const base64Buff = decode(uInt8Array) as Uint8Array;
    const base64Str = String.fromCharCode(...base64Buff);
    const programs = JSON.parse(base64Str);

    return programs;
};
