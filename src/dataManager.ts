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
        return decodeStringToObject(localStoragePrograms);
    }
    const programsRsp = await fetch('./programs.txt');
    const programsTxt = await programsRsp.text();

    return decodeStringToObject(programsTxt);
};

/**
 * Saves the given array of programs to local storage after encrypting them.
 *
 * @param programs The programs to be saved
 */
export const savePrograms = async (programs: ProgramT[]): Promise<void> => {
    const programData = encodeObjectToString(programs);
    window.localStorage.setItem(PROGRAM_DATA_KEY, programData);
};

/**
 * Encodes a JavaScript object using MessagePack and converts the result to a string.
 *
 * @param programs The JavaScript object to encode
 * @returns The encoded string representation of the object.
 */
export const encodeObjectToString = (programs: ProgramT[]): string => {
    const encodedArray = encode(programs) as Uint8Array;
    const encodedString = Array.from(encodedArray).map(byte => byte.toString()).join(' ');

    return encodedString;
};

/**
 * Decodes a string representation of an object back into the original JavaScript object.
 *
 * @param encodedString The encoded string representation of the object
 * @returns The decoded JavaScript object.
 */
export const decodeStringToObject = (encodedString: string): ProgramT[] => {
    const byteArray = encodedString.split(' ').map(byte => Number.parseInt(byte));
    const uInt8Array = Uint8Array.from(byteArray);
    const decodedObject = decode(uInt8Array) as ProgramT[];

    console.log(decodedObject);
    return decodedObject;
};
